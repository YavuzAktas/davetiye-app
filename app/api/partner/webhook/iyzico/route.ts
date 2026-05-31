import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { paketGetir } from "@/lib/partner-paketler";

function dogrulaImza(payload: string, gelen: string): boolean {
  const secret = process.env.IYZICO_SECRET_KEY ?? "";
  const beklenen = createHmac("sha1", secret).update(payload).digest("base64");
  try {
    return timingSafeEqual(Buffer.from(beklenen), Buffer.from(gelen));
  } catch {
    return beklenen === gelen;
  }
}

function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();

  const imza = req.headers.get("x-iyzi-signature") ?? "";
  if (imza && !dogrulaImza(rawBody, imza)) {
    return NextResponse.json({ hata: "Geçersiz imza." }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ hata: "Geçersiz JSON." }, { status: 400 });
  }

  const eventType: string = event.iyziEventType ?? event.eventType ?? "";
  const data = event.data ?? event;

  // Otomatik yenileme başarılı: hakları sıfırla + tarihleri güncelle
  if (eventType === "SUBSCRIPTION_ORDER_SUCCESS" || eventType === "subscription.order.success") {
    const subRef: string | undefined = data.subscriptionReferenceCode;
    const pricingPlanRef: string | undefined = data.pricingPlanReferenceCode;

    if (!subRef) return NextResponse.json({ ok: true });

    const abonelik = await prisma.partnerAbonelik.findUnique({
      where: { iyzicoSubscriptionReferenceCode: subRef },
      select: { id: true, paketId: true, partnerId: true },
    });
    if (!abonelik) return NextResponse.json({ ok: true });

    const paket = paketGetir(abonelik.paketId);
    if (!paket) return NextResponse.json({ ok: true });

    const simdi = new Date();
    const sonrakiTahsilatAt = new Date(simdi.getTime() + 30 * 24 * 60 * 60 * 1000);

    await prisma.partnerAbonelik.update({
      where: { id: abonelik.id },
      data: {
        kullanilanHak: 0,
        hakSayisi: paket.hakSayisi,
        baslangicAt: simdi,
        bitisAt: sonrakiTahsilatAt,
        aktif: true,
        sonTahsilatAt: simdi,
        sonrakiTahsilatAt,
        iyzicoPricingPlanReferenceCode: pricingPlanRef ?? undefined,
      },
    });

    return NextResponse.json({ ok: true });
  }

  // Abonelik iptal veya askıya alma
  if (
    eventType === "SUBSCRIPTION_CANCELED" ||
    eventType === "subscription.canceled" ||
    eventType === "SUBSCRIPTION_UPGRADED" ||
    eventType === "SUBSCRIPTION_DEACTIVATED"
  ) {
    const subRef: string | undefined = data.subscriptionReferenceCode;
    if (!subRef) return NextResponse.json({ ok: true });

    const abonelik = await prisma.partnerAbonelik.findUnique({
      where: { iyzicoSubscriptionReferenceCode: subRef },
      select: { id: true },
    });
    if (!abonelik) return NextResponse.json({ ok: true });

    await prisma.partnerAbonelik.update({
      where: { id: abonelik.id },
      data: {
        otomatikYenileme: false,
        abonelikDurumu: "iptal",
        iptalAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
