import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aktivasyonKoduKullanilanBildir } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";

const KULLANILABILIR = new Set(["olusturuldu", "gonderildi"]);

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ kod: string }> }
): Promise<NextResponse> {
  const simdi = new Date();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const { kod } = await params;

  const aktivasyon = await prisma.aktivasyonKodu.findUnique({
    where: { kod },
    select: {
      id: true,
      durum: true,
      musteriUserId: true,
      expiresAt: true,
      abonelik: { select: { aktif: true, bitisAt: true } },
      partner: {
        select: {
          durum: true,
          firmaAdi: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  if (!aktivasyon) {
    return NextResponse.json({ error: "Geçersiz aktivasyon kodu." }, { status: 404 });
  }

  if (aktivasyon.partner.durum !== "aktif") {
    return NextResponse.json({ error: "Bu partner hesabı aktif olmadığı için link kullanılamaz." }, { status: 409 });
  }

  const kodSuresiGecerli = !aktivasyon.expiresAt || aktivasyon.expiresAt > simdi;
  const abonelikGecerli =
    aktivasyon.abonelik &&
    aktivasyon.abonelik.aktif &&
    (!aktivasyon.abonelik.bitisAt || aktivasyon.abonelik.bitisAt > simdi);

  if (!kodSuresiGecerli || !abonelikGecerli) {
    return NextResponse.json({ error: "Bu aktivasyon linkinin süresi dolmuş." }, { status: 409 });
  }

  // Zaten bu kullanıcıya bağlı → idempotent, izin ver
  if (aktivasyon.musteriUserId === session.user.id && aktivasyon.durum === "kayit_oldu") {
    return NextResponse.json({ ok: true });
  }

  // Başka birine bağlı
  if (aktivasyon.musteriUserId && aktivasyon.musteriUserId !== session.user.id) {
    return NextResponse.json({ error: "Bu link başka bir kullanıcı tarafından kullanılmış." }, { status: 409 });
  }

  // İptal / zaten davetiye oluşturulmuş
  if (!KULLANILABILIR.has(aktivasyon.durum)) {
    return NextResponse.json({ error: "Bu link artık kullanılamaz." }, { status: 409 });
  }

  await prisma.aktivasyonKodu.update({
    where: { id: aktivasyon.id },
    data: {
      musteriUserId: session.user.id,
      durum: "kayit_oldu",
      kullanilanAt: new Date(),
    },
  });

  // Partner'a bildirim — fire and forget
  const partnerEmail = aktivasyon.partner.user.email;
  if (partnerEmail) {
    aktivasyonKoduKullanilanBildir({
      partnerEmail,
      firmaAdi: aktivasyon.partner.firmaAdi,
      kod,
      panelUrl: `${getSiteUrl()}/partner/panel`,
    });
  }

  return NextResponse.json({ ok: true });
}
