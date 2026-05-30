import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dahilKodlarGetir } from "@/lib/partner-paketler";

const GECERLI_DURUMLAR = new Set(["olusturuldu", "gonderildi", "kayit_oldu"]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kod: string }> }
) {
  const { kod } = await params;

  const aktivasyon = await prisma.aktivasyonKodu.findUnique({
    where: { kod },
    select: {
      durum: true,
      partner: {
        select: {
          firmaAdi: true,
          durum: true,
          abonelikler: {
            where: { aktif: true },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { paketId: true },
          },
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

  const paketId = aktivasyon.partner.abonelikler[0]?.paketId ?? "baslangic";
  const dahilKodlar = dahilKodlarGetir(paketId);

  return NextResponse.json({
    firmaAdi: aktivasyon.partner.firmaAdi,
    paketId,
    dahilKodlar,
  });
}
