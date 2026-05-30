import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const IPTAL_EDILEBILİR = ["olusturuldu", "gonderildi"];

export async function PATCH(
  req: NextRequest,
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
  const body = await req.json().catch(() => ({}));
  const action: string = body.action ?? "iptal";

  if (action !== "iptal" && action !== "gonderildi") {
    return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
  }

  const aktivasyon = await prisma.aktivasyonKodu.findUnique({
    where: { kod },
    select: { id: true, partnerId: true, abonelikId: true, durum: true, expiresAt: true },
  });

  if (!aktivasyon || aktivasyon.partnerId !== partner.id) {
    return NextResponse.json({ error: "Kod bulunamadı." }, { status: 404 });
  }

  if (aktivasyon.expiresAt && aktivasyon.expiresAt < new Date() && action === "gonderildi") {
    return NextResponse.json({ error: "Süresi dolan kod gönderilemez." }, { status: 409 });
  }

  if (action === "gonderildi") {
    if (aktivasyon.durum !== "olusturuldu") {
      return NextResponse.json({ error: "Yalnızca 'oluşturuldu' durumundaki kodlar gönderilebilir." }, { status: 409 });
    }
    await prisma.aktivasyonKodu.update({
      where: { id: aktivasyon.id },
      data: { durum: "gonderildi" },
    });
    return NextResponse.json({ ok: true });
  }

  // action === "iptal"
  if (!IPTAL_EDILEBILİR.includes(aktivasyon.durum)) {
    return NextResponse.json(
      { error: "Bu kod artık iptal edilemez (müşteri tarafından kullanılmış)." },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.aktivasyonKodu.update({
      where: { id: aktivasyon.id },
      data: { durum: "iptal" },
    });

    if (aktivasyon.abonelikId) {
      await tx.partnerAbonelik.updateMany({
        where: { id: aktivasyon.abonelikId, partnerId: partner.id, kullanilanHak: { gt: 0 } },
        data: { kullanilanHak: { decrement: 1 } },
      });
      return;
    }

    await tx.partnerAbonelik.updateMany({
      where: { partnerId: partner.id, aktif: true, kullanilanHak: { gt: 0 } },
      data: { kullanilanHak: { decrement: 1 } },
    });
  });

  return NextResponse.json({ ok: true });
}
