import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    select: { id: true, durum: true },
  });

  if (!partner || partner.durum !== "aktif") {
    return NextResponse.json({ error: "Aktif partner hesabı gerekli." }, { status: 403 });
  }

  const abonelik = await prisma.partnerAbonelik.findFirst({
    where: { partnerId: partner.id, aktif: true },
    select: { id: true, hakSayisi: true, kullanilanHak: true },
  });

  if (!abonelik) {
    return NextResponse.json({ error: "Aktif abonelik bulunamadı." }, { status: 403 });
  }

  if (abonelik.kullanilanHak >= abonelik.hakSayisi) {
    return NextResponse.json({ error: "Bu ay için aktivasyon hakkınız tükendi." }, { status: 403 });
  }

  // Atomik: nanoid çakışmasına karşı retry (ihtimali çok düşük ama önlem)
  let kod: string | null = null;
  for (let i = 0; i < 5; i++) {
    const aday = nanoid(12);
    const mevcut = await prisma.aktivasyonKodu.findUnique({ where: { kod: aday } });
    if (!mevcut) { kod = aday; break; }
  }
  if (!kod) {
    return NextResponse.json({ error: "Kod üretilemedi, tekrar deneyin." }, { status: 500 });
  }

  const [yeniKod] = await prisma.$transaction([
    prisma.aktivasyonKodu.create({
      data: {
        partnerId: partner.id,
        kod,
        durum: "olusturuldu",
      },
    }),
    prisma.partnerAbonelik.update({
      where: { id: abonelik.id },
      data: { kullanilanHak: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ kod: yeniKod.kod, id: yeniKod.id });
}
