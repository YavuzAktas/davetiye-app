import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { partnerOnayBildir } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const action: string = body.action ?? "";

  const GECERLI_AKSIYONLAR = ["onayla", "reddet", "askiya-al", "aktifleştir"] as const;
  type Aksiyon = typeof GECERLI_AKSIYONLAR[number];

  if (!GECERLI_AKSIYONLAR.includes(action as Aksiyon)) {
    return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
  }

  const partner = await prisma.partner.findUnique({
    where: { id },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!partner) {
    return NextResponse.json({ error: "Partner bulunamadı." }, { status: 404 });
  }

  const DURUM_MAP: Record<Aksiyon, string> = {
    "onayla": "aktif",
    "reddet": "askida",
    "askiya-al": "askida",
    "aktifleştir": "aktif",
  };

  const yeniDurum = DURUM_MAP[action as Aksiyon];
  await prisma.partner.update({ where: { id }, data: { durum: yeniDurum } });

  if ((action === "onayla" || action === "aktifleştir") && partner.user.email) {
    await partnerOnayBildir({
      email: partner.user.email,
      partnerAdi: partner.user.name ?? partner.user.email,
      firmaAdi: partner.firmaAdi,
      panelUrl: `${getSiteUrl()}/partner/panel`,
    });
  }

  return NextResponse.json({ durum: yeniDurum });
}
