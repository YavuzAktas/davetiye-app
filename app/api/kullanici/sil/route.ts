import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

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
          sesliAnilar: { select: { dosyaUrl: true } },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const blobUrlSet = new Set<string>();
  for (const davetiye of user.davetiyeler) {
    [davetiye.polaroid1, davetiye.polaroid2, davetiye.polaroid3].forEach((url) => {
      if (url) blobUrlSet.add(url);
    });
    davetiye.albumFotolar.forEach((foto) => blobUrlSet.add(foto.dosyaUrl));
    davetiye.sesliAnilar.forEach((ani) => blobUrlSet.add(ani.dosyaUrl));
  }

  if (blobUrlSet.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del([...blobUrlSet]);
    } catch (err) {
      console.error("Hesap silme sırasında blob temizleme hatası:", err);
    }
  }

  // Cascade: Account, Session, OdemeToken, Davetiye (→ RSVP, Davetli, medya kayıtları) silinir.
  // OdemeKaydi kayıtları yasal saklama amacıyla userId=null yapılarak korunur.
  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ basarili: true });
}
