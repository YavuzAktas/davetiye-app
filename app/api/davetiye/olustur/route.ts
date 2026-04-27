import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { authOptions } from "@/lib/auth";
import { PLAN_LIMITLER, PlanTipi } from "@/lib/planlar";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { hata: "Giris yapmaniz gerekiyor." },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { baslik, etkinlikTur, tarih, saat, mekan, mesaj, sablon, font, renk } = body;

  if (!baslik || !mekan || !tarih) {
    return NextResponse.json(
      { hata: "Zorunlu alanlar eksik." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { hata: "Kullanici bulunamadi." },
      { status: 404 }
    );
  }

  const planLimiti = PLAN_LIMITLER[user.plan as PlanTipi] ?? PLAN_LIMITLER.free;
  const mevcutDavetiyeSayisi = await prisma.davetiye.count({
    where: { userId: user.id, aktif: true },
  });

  if (mevcutDavetiyeSayisi >= planLimiti.davetiyeLimit) {
    return NextResponse.json(
      {
        hata: planLimiti.isim + " planinda en fazla " + planLimiti.davetiyeLimit + " davetiye olusturabilirsiniz. Planinizi yukseltin.",
        limitAsimi: true,
      },
      { status: 403 }
    );
  }

  const slug = nanoid(10);
  const tarihSaat = saat
    ? new Date(tarih + "T" + saat + ":00")
    : new Date(tarih);

  const davetiye = await prisma.davetiye.create({
    data: {
      slug,
      baslik,
      etkinlikTur,
      tarih: tarihSaat,
      mekan,
      mesaj,
      sablon,
      font: font || "font-sans",
      ozelRenk: renk || null,
      userId: user.id,
    },
  });

  return NextResponse.json({ slug: davetiye.slug });
}
