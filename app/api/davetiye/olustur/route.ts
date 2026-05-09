import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { authOptions } from "@/lib/auth";
import { PLAN_CONFIG, LUKS_SABLON_IDS, planOzellikVar, PlanTipi } from "@/lib/planlar";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const body = await req.json();
  const { baslik, etkinlikTur, tarih, saat, mekan, mesaj, sablon, font, renk, kisi1, kisi2, muzik } = body;

  if (!baslik || !mekan || !tarih) {
    return NextResponse.json({ hata: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  // Plan ve davetiye sayısını tek sorguda al — session.user.id ile ekstra findUnique kaldırıldı
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, plan: true },
  });

  if (!user) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  if (LUKS_SABLON_IDS.has(sablon) && !planOzellikVar(user.plan, "luksablonlar")) {
    return NextResponse.json(
      { hata: "Bu lüks şablon Standart ve Premium planlara özel.", upsell: true },
      { status: 403 }
    );
  }

  if (muzik && !planOzellikVar(user.plan, "muzik")) {
    return NextResponse.json(
      { hata: "Müzik ekleme Standart ve Premium planlara özel.", upsell: true },
      { status: 403 }
    );
  }

  const planLimiti = PLAN_CONFIG[user.plan as PlanTipi] ?? PLAN_CONFIG.free;
  const mevcutDavetiyeSayisi = await prisma.davetiye.count({
    where: { userId: user.id, aktif: true },
  });

  if (mevcutDavetiyeSayisi >= planLimiti.maxDavetiye) {
    return NextResponse.json(
      {
        hata: `Planınızda en fazla ${planLimiti.maxDavetiye} davetiye oluşturabilirsiniz. Planınızı yükseltin.`,
        upsell: true,
      },
      { status: 403 }
    );
  }

  const slug = nanoid(10);
  const tarihSaat = saat ? new Date(`${tarih}T${saat}:00`) : new Date(tarih);

  const davetiye = await prisma.davetiye.create({
    data: {
      slug,
      baslik,
      etkinlikTur,
      tarih: tarihSaat,
      mekan,
      mesaj,
      sablon,
      font:     font  || "font-sans",
      ozelRenk: renk  || null,
      muzik:    muzik || null,
      userId:   user.id,
      kisi1:    kisi1 || null,
      kisi2:    kisi2 || null,
    },
  });

  return NextResponse.json({ slug: davetiye.slug });
}
