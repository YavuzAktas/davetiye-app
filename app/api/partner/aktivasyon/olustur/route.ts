import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const simdi = new Date();
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
    where: {
      partnerId: partner.id,
      aktif: true,
      OR: [{ bitisAt: null }, { bitisAt: { gt: simdi } }],
    },
    select: { id: true, hakSayisi: true, kullanilanHak: true, bitisAt: true },
  });

  if (!abonelik) {
    return NextResponse.json({ error: "Aktif abonelik bulunamadı." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const adet = Math.min(5, Math.max(1, parseInt(body.adet ?? "1", 10) || 1));
  const kalanHak = abonelik.hakSayisi - abonelik.kullanilanHak;
  if (adet > kalanHak) {
    return NextResponse.json(
      { error: `Yalnızca ${kalanHak} hak kaldı. ${adet} kod oluşturulamaz.` },
      { status: 403 }
    );
  }

  // Benzersiz kodları önceden üret
  const kodlar: string[] = [];
  for (let i = 0; i < adet; i++) {
    let kod: string | null = null;
    for (let j = 0; j < 5; j++) {
      const aday = nanoid(12);
      const mevcut = await prisma.aktivasyonKodu.findUnique({ where: { kod: aday } });
      if (!mevcut) { kod = aday; break; }
    }
    if (!kod) return NextResponse.json({ error: "Kod üretilemedi, tekrar deneyin." }, { status: 500 });
    kodlar.push(kod);
  }

  const olusturulanlar = await prisma.$transaction(async (tx) => {
    const hakGuncelleme = await tx.partnerAbonelik.updateMany({
      where: {
        id: abonelik.id,
        kullanilanHak: { lte: abonelik.hakSayisi - adet },
        aktif: true,
        OR: [{ bitisAt: null }, { bitisAt: { gt: simdi } }],
      },
      data: { kullanilanHak: { increment: adet } },
    });

    if (hakGuncelleme.count !== 1) return null;

    return Promise.all(
      kodlar.map(kod =>
        tx.aktivasyonKodu.create({
          data: {
            partnerId: partner.id,
            abonelikId: abonelik.id,
            kod,
            durum: "olusturuldu",
            expiresAt: abonelik.bitisAt,
          },
        })
      )
    );
  });

  if (!olusturulanlar) {
    return NextResponse.json({ error: "Bu ay için aktivasyon hakkınız tükendi." }, { status: 403 });
  }

  return NextResponse.json({ kodlar: olusturulanlar.map(k => ({ kod: k.kod, id: k.id })) });
}
