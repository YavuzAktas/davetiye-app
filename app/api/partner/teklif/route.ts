import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type TeklifNot = { id: string; metin: string; createdAt: string };

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });

  const partner = await prisma.partner.findUnique({ where: { userId: session.user.id } });
  if (!partner) return NextResponse.json({ hata: "Partner bulunamadı" }, { status: 404 });

  const body = await req.json();
  const { aksiyon, metin, notId } = body as { aksiyon: string; metin?: string; notId?: string };

  const mevcutNotlar: TeklifNot[] = Array.isArray(partner.teklifNotlari)
    ? (partner.teklifNotlari as TeklifNot[])
    : [];

  if (aksiyon === "hazir-isaretle") {
    await prisma.partner.update({
      where: { id: partner.id },
      data: { teklifHazir: true },
    });
    return NextResponse.json({ tamam: true });
  }

  if (aksiyon === "not-ekle") {
    if (!metin?.trim()) return NextResponse.json({ hata: "Metin boş olamaz" }, { status: 400 });
    const yeniNot: TeklifNot = {
      id: crypto.randomUUID(),
      metin: metin.trim(),
      createdAt: new Date().toISOString(),
    };
    await prisma.partner.update({
      where: { id: partner.id },
      data: {
        teklifNotlari: [...mevcutNotlar, yeniNot],
        teklifHazir: true,
      },
    });
    return NextResponse.json({ not: yeniNot });
  }

  if (aksiyon === "not-sil") {
    if (!notId) return NextResponse.json({ hata: "notId gerekli" }, { status: 400 });
    const guncellenmis = mevcutNotlar.filter(n => n.id !== notId);
    await prisma.partner.update({
      where: { id: partner.id },
      data: { teklifNotlari: guncellenmis },
    });
    return NextResponse.json({ tamam: true });
  }

  return NextResponse.json({ hata: "Geçersiz aksiyon" }, { status: 400 });
}
