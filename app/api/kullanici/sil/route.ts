import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bloblariSilVeyaKuyrugaAl } from "@/lib/medya-silme";
import { imhaKayitlariOlustur } from "@/lib/imha-kaydi";
import { yasalOnayKayitlariniHesapSilindiIsaretle } from "@/lib/yasal-onay-kaydi";

export async function DELETE(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      davetiyeler: {
        select: {
          polaroid1: true,
          polaroid2: true,
          polaroid3: true,
          albumFotolar: { select: { dosyaUrl: true } },
          aniDefterleri: { select: { id: true } },
          sesliAnilar: { select: { dosyaUrl: true } },
          _count: {
            select: {
              rsvplar: true,
              davetliler: true,
            },
          },
        },
      },
      geciciYuklemeler: {
        select: { dosyaUrl: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const blobUrlSet = new Set<string>();
  let rsvpAdet = 0;
  let davetliAdet = 0;
  let albumFotoAdet = 0;
  let aniDefteriAdet = 0;
  let sesliAniAdet = 0;

  for (const davetiye of user.davetiyeler) {
    rsvpAdet += davetiye._count.rsvplar;
    davetliAdet += davetiye._count.davetliler;
    albumFotoAdet += davetiye.albumFotolar.length;
    aniDefteriAdet += davetiye.aniDefterleri.length;
    sesliAniAdet += davetiye.sesliAnilar.length;

    [davetiye.polaroid1, davetiye.polaroid2, davetiye.polaroid3].forEach((url) => {
      if (url) blobUrlSet.add(url);
    });
    davetiye.albumFotolar.forEach((foto) => blobUrlSet.add(foto.dosyaUrl));
    davetiye.sesliAnilar.forEach((ani) => blobUrlSet.add(ani.dosyaUrl));
  }
  user.geciciYuklemeler.forEach((yukleme) => blobUrlSet.add(yukleme.dosyaUrl));

  if (blobUrlSet.size > 0) {
    await bloblariSilVeyaKuyrugaAl([...blobUrlSet], "hesap-silme");
  }

  // Cascade: Account, Session, OdemeToken, Davetiye (→ RSVP, Davetli, medya kayıtları) silinir.
  // OdemeKaydi kayıtları yasal saklama amacıyla userId=null yapılarak korunur.
  await prisma.user.delete({ where: { id: user.id } });
  await yasalOnayKayitlariniHesapSilindiIsaretle(user.id);

  await imhaKayitlariOlustur([
    {
      kaynak: "hesap-silme",
      islemTuru: "ilgili-kisi-talebi",
      veriKategorisi: "Kullanıcı hesabı ve kimlik doğrulama kayıtları",
      adet: 1,
      yontem: "veritabanı cascade silme",
      gerekce: "Kullanıcı hesabı silme talebi",
    },
    {
      kaynak: "hesap-silme",
      islemTuru: "ilgili-kisi-talebi",
      veriKategorisi: "Davetiye kayıtları",
      adet: user.davetiyeler.length,
      yontem: "veritabanı cascade silme",
      gerekce: "Kullanıcı hesabı silme talebi",
    },
    {
      kaynak: "hesap-silme",
      islemTuru: "ilgili-kisi-talebi",
      veriKategorisi: "RSVP kayıtları",
      adet: rsvpAdet,
      yontem: "veritabanı cascade silme",
      gerekce: "Kullanıcı hesabı silme talebi",
    },
    {
      kaynak: "hesap-silme",
      islemTuru: "ilgili-kisi-talebi",
      veriKategorisi: "Davetli listesi kayıtları",
      adet: davetliAdet,
      yontem: "veritabanı cascade silme",
      gerekce: "Kullanıcı hesabı silme talebi",
    },
    {
      kaynak: "hesap-silme",
      islemTuru: "ilgili-kisi-talebi",
      veriKategorisi: "Yazılı anı kayıtları",
      adet: aniDefteriAdet,
      yontem: "veritabanı cascade silme",
      gerekce: "Kullanıcı hesabı silme talebi",
    },
    {
      kaynak: "hesap-silme",
      islemTuru: "ilgili-kisi-talebi",
      veriKategorisi: "Album fotoğraf kayıtları",
      adet: albumFotoAdet,
      yontem: "Vercel Blob silme/kuyruğa alma ve veritabanı cascade silme",
      gerekce: "Kullanıcı hesabı silme talebi",
    },
    {
      kaynak: "hesap-silme",
      islemTuru: "ilgili-kisi-talebi",
      veriKategorisi: "Sesli anı kayıtları",
      adet: sesliAniAdet,
      yontem: "Vercel Blob silme/kuyruğa alma ve veritabanı cascade silme",
      gerekce: "Kullanıcı hesabı silme talebi",
    },
    {
      kaynak: "hesap-silme",
      islemTuru: "ilgili-kisi-talebi",
      veriKategorisi: "Medya dosyaları",
      adet: blobUrlSet.size,
      yontem: "Vercel Blob silme veya silme kuyruğuna alma",
      gerekce: "Kullanıcı hesabı silme talebi",
    },
  ]);

  return NextResponse.json({ basarili: true });
}
