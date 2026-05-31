import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { partnerBasvuruAdminBildir } from "@/lib/email";
import { ADMIN_EMAILS } from "@/lib/admin";
import { getSiteUrl } from "@/lib/site-url";

function temizle(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    select: { id: true, firmaAdi: true, durum: true, createdAt: true },
  });

  return NextResponse.json({ partner });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const mevcutPartner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    select: { id: true, firmaAdi: true, durum: true },
  });
  if (mevcutPartner) {
    return NextResponse.json(
      { error: "Bu hesap için zaten bir partner kaydı mevcut.", partner: mevcutPartner },
      { status: 409 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const firmaAdi = temizle(body.firmaAdi, 150);
  const telefon = temizle(body.telefon, 30);
  const firmaTuru = temizle(body.firmaTuru, 100);
  const aylikMusteriSayisi = temizle(body.aylikMusteriSayisi, 50);
  const basvuruNotu = temizle(body.basvuruNotu, 500);

  if (!firmaAdi || !telefon || !firmaTuru || !aylikMusteriSayisi) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const partner = await prisma.partner.create({
    data: {
      userId: session.user.id,
      firmaAdi,
      durum: "beklemede",
      basvuruDetay: { telefon, firmaTuru, aylikMusteriSayisi, basvuruNotu },
    },
  }).catch((err: any) => {
    if (err?.code === "P2002") return null;
    throw err;
  });

  if (!partner) {
    const mevcut = await prisma.partner.findUnique({
      where: { userId: session.user.id },
      select: { id: true, firmaAdi: true, durum: true },
    });
    return NextResponse.json(
      { error: "Bu hesap için zaten bir partner kaydı mevcut.", partner: mevcut },
      { status: 409 }
    );
  }

  await partnerBasvuruAdminBildir({
    partnerAdi: session.user.name ?? session.user.email ?? "",
    firmaAdi,
    email: session.user.email ?? "",
    firmaTuru,
    aylikMusteriSayisi,
    basvuruNotu,
    adminPanelUrl: `${getSiteUrl()}/admin/partnerler`,
    adminEmails: ADMIN_EMAILS,
  });

  return NextResponse.json({ id: partner.id });
}
