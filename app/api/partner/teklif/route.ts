import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ipIzinVer } from "@/lib/rate-limit";

type TeklifNot = { id: string; metin: string; createdAt: string };

const teklifSemasi = z.discriminatedUnion("aksiyon", [
  z.object({ aksiyon: z.literal("hazir-isaretle") }).strict(),
  z.object({ aksiyon: z.literal("not-ekle"), metin: z.string().trim().min(1).max(2000) }).strict(),
  z.object({ aksiyon: z.literal("not-sil"), notId: z.string().min(1).max(80) }).strict(),
]);

function teklifNotuMu(not: unknown): not is TeklifNot {
  return (
    typeof not === "object" &&
    not !== null &&
    "id" in not &&
    "metin" in not &&
    "createdAt" in not &&
    typeof not.id === "string" &&
    typeof not.metin === "string" &&
    typeof not.createdAt === "string"
  );
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });

  if (!(await ipIzinVer("partner-teklif", session.user.id, 30, 60 * 60_000))) {
    return NextResponse.json({ hata: "Saatlik teklif güncelleme limitine ulaştınız." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const sonuc = teklifSemasi.safeParse(body);
  if (!sonuc.success) {
    return NextResponse.json({ hata: "Teklif isteği geçersiz." }, { status: 400 });
  }

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    select: { id: true, durum: true, teklifNotlari: true },
  });
  if (!partner) return NextResponse.json({ hata: "Partner bulunamadı" }, { status: 404 });
  if (partner.durum !== "aktif") {
    return NextResponse.json({ hata: "Aktif partner hesabı gerekli." }, { status: 403 });
  }

  const mevcutNotlar: TeklifNot[] = Array.isArray(partner.teklifNotlari)
    ? partner.teklifNotlari.filter(teklifNotuMu).slice(0, 20)
    : [];

  const veri = sonuc.data;

  if (veri.aksiyon === "hazir-isaretle") {
    await prisma.partner.update({
      where: { id: partner.id },
      data: { teklifHazir: true },
    });
    return NextResponse.json({ tamam: true });
  }

  if (veri.aksiyon === "not-ekle") {
    if (mevcutNotlar.length >= 20) {
      return NextResponse.json({ hata: "En fazla 20 teklif notu saklanabilir." }, { status: 409 });
    }

    const yeniNot: TeklifNot = {
      id: crypto.randomUUID(),
      metin: veri.metin,
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

  if (veri.aksiyon === "not-sil") {
    const guncellenmis = mevcutNotlar.filter(n => n.id !== veri.notId);
    await prisma.partner.update({
      where: { id: partner.id },
      data: { teklifNotlari: guncellenmis },
    });
    return NextResponse.json({ tamam: true });
  }

  return NextResponse.json({ hata: "Geçersiz aksiyon" }, { status: 400 });
}
