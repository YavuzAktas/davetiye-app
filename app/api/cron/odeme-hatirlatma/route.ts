import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { odemeHatirlatmaGonder } from "@/lib/email";
import { cronSecretEksik, cronYetkiliMi } from "@/lib/cron-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  if (cronSecretEksik()) {
    return NextResponse.json(
      { error: "Ödeme hatırlatma görevi yapılandırılmamış." },
      { status: 503 },
    );
  }

  if (!cronYetkiliMi(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const simdi = new Date();
  const min30Once = new Date(simdi.getTime() - 30 * 60 * 1000);
  const saat23Once = new Date(simdi.getTime() - 23 * 60 * 60 * 1000);
  const saat48Once = new Date(simdi.getTime() - 48 * 60 * 60 * 1000);

  let gonderilen30dk = 0;
  let gonderilen24saat = 0;
  let hatalar = 0;

  /* ── 1. İlk hatırlatma: 30 dk – 23 saat arası, mail henüz gönderilmemiş ── */
  const ilkAday = await prisma.davetiye.findMany({
    where: {
      odemeDurumu: { not: "odendi" },
      hatirlatiMail30dk: false,
      createdAt: { lte: min30Once, gte: saat23Once },
    },
    select: {
      id: true, baslik: true, slug: true,
      user: { select: { email: true, name: true } },
    },
    take: 50,
  });

  for (const d of ilkAday) {
    if (!d.user.email) continue;
    try {
      await odemeHatirlatmaGonder({
        email:           d.user.email,
        adSoyad:         d.user.name ?? "Merhaba",
        davetiyeBaslik:  d.baslik,
        davetiyeSlug:    d.slug,
        tip:             "30dk",
      });
      await prisma.davetiye.update({
        where: { id: d.id },
        data:  { hatirlatiMail30dk: true },
      });
      gonderilen30dk++;
    } catch {
      hatalar++;
    }
  }

  /* ── 2. İkinci hatırlatma: 23 saat – 48 saat arası, ilk mail gönderilmiş ── */
  const ikinciAday = await prisma.davetiye.findMany({
    where: {
      odemeDurumu:        { not: "odendi" },
      hatirlatiMail30dk:   true,
      hatirlatiMail24saat: false,
      createdAt:           { lte: saat23Once, gte: saat48Once },
    },
    select: {
      id: true, baslik: true, slug: true,
      user: { select: { email: true, name: true } },
    },
    take: 50,
  });

  for (const d of ikinciAday) {
    if (!d.user.email) continue;
    try {
      await odemeHatirlatmaGonder({
        email:           d.user.email,
        adSoyad:         d.user.name ?? "Merhaba",
        davetiyeBaslik:  d.baslik,
        davetiyeSlug:    d.slug,
        tip:             "24saat",
      });
      await prisma.davetiye.update({
        where: { id: d.id },
        data:  { hatirlatiMail24saat: true },
      });
      gonderilen24saat++;
    } catch {
      hatalar++;
    }
  }

  console.log(`[odeme-hatirlatma] 30dk:${gonderilen30dk} 24saat:${gonderilen24saat} hata:${hatalar}`);

  return NextResponse.json({ gonderilen30dk, gonderilen24saat, hatalar });
}
