import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { authOptions } from "@/lib/auth";
import { davetiyeFiyatiHesapla } from "@/lib/davetiye-fiyatlandirma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const body = await req.json();
  const { baslik, etkinlikTur, tarih, saat, mekan, mesaj, sablon, font, renk, kisi1, kisi2, muzik, polaroid1, polaroid2, polaroid3, sesliAniAktif, canliDuvarAktif, oturmaPlanAktif, dressKod, dressKodRenkler, albumAktif } = body;

  if (!baslik || !mekan || !tarih) {
    return NextResponse.json({ hata: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const slug = nanoid(10);
  const tarihSaat = saat ? new Date(`${tarih}T${saat}:00`) : new Date(tarih);
  const fiyat = davetiyeFiyatiHesapla({
    sablon,
    muzik: muzik || null,
    albumAktif: !!albumAktif,
    sesliAniAktif: !!sesliAniAktif,
    canliDuvarAktif: !!canliDuvarAktif,
    oturmaPlanAktif: !!oturmaPlanAktif,
  });

  const davetiye = await prisma.davetiye.create({
    data: {
      slug,
      baslik,
      etkinlikTur,
      tarih:           tarihSaat,
      mekan,
      mesaj,
      sablon,
      aktif:           false,
      font:            font  || "font-sans",
      ozelRenk:        renk  || null,
      muzik:           muzik || null,
      userId:          user!.id,
      kisi1:           kisi1 || null,
      kisi2:           kisi2 || null,
      polaroid1:       polaroid1 || null,
      polaroid2:       polaroid2 || null,
      polaroid3:       polaroid3 || null,
      sesliAniAktif:   !!sesliAniAktif,
      canliDuvarAktif: !!canliDuvarAktif,
      oturmaPlanAktif: !!oturmaPlanAktif,
      dressKod:        dressKod || null,
      dressKodRenkler: dressKodRenkler || null,
      albumAktif:      !!albumAktif,
      odemeDurumu:     "odeme_bekliyor",
      fiyatSnapshot:   fiyat as any,
    },
  });

  const kullanilanPolaroidler = [polaroid1, polaroid2, polaroid3].filter(Boolean) as string[];
  if (kullanilanPolaroidler.length > 0) {
    await prisma.geciciYukleme.updateMany({
      where: {
        userId: user.id,
        dosyaUrl: { in: kullanilanPolaroidler },
        kullanildi: false,
      },
      data: {
        kullanildi: true,
        usedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ id: davetiye.id, slug: davetiye.slug, fiyat });
}
