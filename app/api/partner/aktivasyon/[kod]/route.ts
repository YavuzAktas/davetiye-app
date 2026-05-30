import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const IPTAL_EDILEBILİR = ["olusturuldu", "gonderildi"];

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ kod: string }> }
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!partner) return NextResponse.json({ error: "Partner bulunamadı." }, { status: 404 });

  const { kod } = await params;

  const aktivasyon = await prisma.aktivasyonKodu.findUnique({
    where: { kod },
    select: { id: true, partnerId: true, durum: true },
  });

  if (!aktivasyon || aktivasyon.partnerId !== partner.id) {
    return NextResponse.json({ error: "Kod bulunamadı." }, { status: 404 });
  }

  if (!IPTAL_EDILEBILİR.includes(aktivasyon.durum)) {
    return NextResponse.json(
      { error: "Bu kod artık iptal edilemez (müşteri tarafından kullanılmış)." },
      { status: 409 }
    );
  }

  await prisma.$transaction([
    prisma.aktivasyonKodu.update({
      where: { id: aktivasyon.id },
      data: { durum: "iptal" },
    }),
    // Aktif abonelik varsa hakkı geri ver
    prisma.partnerAbonelik.updateMany({
      where: { partnerId: partner.id, aktif: true },
      data: { kullanilanHak: { decrement: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
