import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dahilKodlarGetir } from "@/lib/partner-paketler";

const GECERLI_DURUMLAR = new Set(["olusturuldu", "gonderildi", "kayit_oldu"]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kod: string }> }
) {
  const simdi = new Date();
  const { kod } = await params;

  const aktivasyon = await prisma.aktivasyonKodu.findUnique({
    where: { kod },
    select: {
      durum: true,
      expiresAt: true,
      abonelik: { select: { paketId: true, aktif: true, bitisAt: true } },
      partner: {
        select: {
          firmaAdi: true,
          durum: true,
        },
      },
    },
  });

  if (!aktivasyon || !GECERLI_DURUMLAR.has(aktivasyon.durum)) {
    return NextResponse.json({ error: "Geçersiz aktivasyon kodu." }, { status: 404 });
  }

  if (aktivasyon.partner.durum !== "aktif") {
    return NextResponse.json({ error: "Partner aktif değil." }, { status: 409 });
  }

  const abonelik = aktivasyon.abonelik;
  const kodSuresiGecerli = !aktivasyon.expiresAt || aktivasyon.expiresAt > simdi;
  const abonelikGecerli =
    abonelik &&
    abonelik.aktif &&
    (!abonelik.bitisAt || abonelik.bitisAt > simdi);

  if (!kodSuresiGecerli || !abonelikGecerli) {
    return NextResponse.json({ error: "Bu aktivasyon linkinin süresi dolmuş." }, { status: 409 });
  }

  const paketId = abonelik.paketId;
  const dahilKodlar = dahilKodlarGetir(paketId);

  return NextResponse.json({
    firmaAdi: aktivasyon.partner.firmaAdi,
    paketId,
    dahilKodlar,
  });
}
