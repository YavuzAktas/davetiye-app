import { NextRequest, NextResponse } from "next/server";
import { createHash, createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { paketGetir } from "@/lib/partner-paketler";

function dogrulaSubscriptionImzasi(eventType: string, data: any, gelen: string): boolean {
  const secret = process.env.IYZICO_SECRET_KEY ?? "";
  const merchantId = process.env.IYZICO_MERCHANT_ID ?? ilkDoluString(data.merchantId);
  const subscriptionReferenceCode = ilkDoluString(data.subscriptionReferenceCode, data.referenceCode);
  const orderReferenceCode = ilkDoluString(data.orderReferenceCode);
  const customerReferenceCode = ilkDoluString(data.customerReferenceCode);

  if (!secret || !merchantId || !eventType || !gelen || !subscriptionReferenceCode || !orderReferenceCode || !customerReferenceCode) {
    return false;
  }

  const mesaj = merchantId + secret + eventType + subscriptionReferenceCode + orderReferenceCode + customerReferenceCode;
  const beklenen = createHmac("sha256", secret).update(mesaj).digest("hex").toLowerCase();
  const gelenNormalize = gelen.trim().toLowerCase();
  try {
    return timingSafeEqual(Buffer.from(beklenen), Buffer.from(gelenNormalize));
  } catch {
    return beklenen === gelenNormalize;
  }
}

function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function ilkDoluString(...degerler: unknown[]): string | null {
  for (const deger of degerler) {
    if (typeof deger === "string" && deger.trim()) return deger.trim();
    if (typeof deger === "number") return String(deger);
  }
  return null;
}

function bodyHash(rawBody: string): string {
  return createHash("sha256").update(rawBody).digest("hex");
}

function eventAnahtari(event: any, data: any, eventType: string, rawBody: string): string {
  const kaynakId = ilkDoluString(
    event.iyziEventId,
    event.eventId,
    event.id,
    event.iyziReferenceCode,
    data.iyziReferenceCode,
    data.orderReferenceCode,
    data.paymentId,
    data.conversationId,
    data.referenceCode
  );
  return kaynakId ? `${eventType}:${kaynakId}` : `${eventType}:${bodyHash(rawBody)}`;
}

function tarihOku(...degerler: unknown[]): Date | null {
  for (const deger of degerler) {
    if (typeof deger !== "string" || !deger.trim()) continue;
    const tarih = new Date(deger);
    if (!isNaN(tarih.getTime())) return tarih;
  }
  return null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ hata: "Geçersiz JSON." }, { status: 400 });
  }

  const eventType: string = event.iyziEventType ?? event.eventType ?? "";
  const data = event.data ?? event;
  const imza = req.headers.get("x-iyz-signature-v3") ?? "";
  if (!dogrulaSubscriptionImzasi(eventType, data, imza)) {
    return NextResponse.json({ hata: "Geçersiz imza." }, { status: 401 });
  }

  const eventKey = eventAnahtari(event, data, eventType || "unknown", rawBody);

  try {
    await prisma.iyzicoWebhookEvent.create({
      data: {
        eventKey,
        eventType: eventType || "unknown",
        bodyHash: bodyHash(rawBody),
      },
    });
  } catch (err: any) {
    if (err?.code === "P2002") return NextResponse.json({ ok: true, tekrar: true });
    console.error("[partner/webhook/iyzico] Event kaydı oluşturulamadı:", err);
    return NextResponse.json({ hata: "Webhook kaydı oluşturulamadı." }, { status: 500 });
  }

  try {
  // Otomatik yenileme başarılı: hakları sıfırla + tarihleri güncelle
  if (eventType === "SUBSCRIPTION_ORDER_SUCCESS" || eventType === "subscription.order.success") {
    const subRef = ilkDoluString(data.subscriptionReferenceCode, data.referenceCode);
    const pricingPlanRef = ilkDoluString(data.pricingPlanReferenceCode);
    const customerRef = ilkDoluString(data.customerReferenceCode);

    if (!subRef) return NextResponse.json({ ok: true });

    const abonelik = await prisma.partnerAbonelik.findFirst({
      where: { iyzicoSubscriptionReferenceCode: subRef },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        paketId: true,
        partnerId: true,
        iyzicoCustomerReferenceCode: true,
        iyzicoPricingPlanReferenceCode: true,
      },
    });
    if (!abonelik) return NextResponse.json({ ok: true });

    const paket = paketGetir(abonelik.paketId);
    if (!paket) return NextResponse.json({ ok: true });

    const simdi = new Date();
    const sonrakiTahsilatAt =
      tarihOku(data.nextPaymentDate, data.nextPaymentDateTime, data.subscriptionEndDate) ??
      new Date(simdi.getTime() + 30 * 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.partnerAbonelik.updateMany({
        where: { partnerId: abonelik.partnerId, aktif: true },
        data: { aktif: false },
      }),
      prisma.partnerAbonelik.create({
        data: {
          partnerId: abonelik.partnerId,
          paketId: abonelik.paketId,
          hakSayisi: paket.hakSayisi,
          kullanilanHak: 0,
          baslangicAt: simdi,
          bitisAt: sonrakiTahsilatAt,
          aktif: true,
          otomatikYenileme: true,
          abonelikDurumu: "aktif",
          iyzicoSubscriptionReferenceCode: subRef,
          iyzicoCustomerReferenceCode: customerRef ?? abonelik.iyzicoCustomerReferenceCode,
          iyzicoPricingPlanReferenceCode: pricingPlanRef ?? abonelik.iyzicoPricingPlanReferenceCode,
          sonTahsilatAt: simdi,
          sonrakiTahsilatAt,
        },
      }),
    ]);

    const paymentId = ilkDoluString(data.paymentId, data.orderReferenceCode);
    if (paymentId) {
      const partner = await prisma.partner.findUnique({
        where: { id: abonelik.partnerId },
        select: { userId: true, user: { select: { email: true } } },
      });
      await prisma.odemeKaydi.create({
        data: {
          userId: partner?.userId,
          userEmail: partner?.user.email,
          planId: abonelik.paketId,
          urunTipi: "partner-paket-yenileme",
          fiyatKirilimi: { paketId: abonelik.paketId, paketAd: paket.ad, tutar: paket.aylikTutar, hakSayisi: paket.hakSayisi },
          paymentId,
          price: String(paket.aylikTutar),
          paidPrice: String(paket.aylikTutar),
          currency: "TRY",
          paymentStatus: "SUCCESS",
        },
      });
    }

    await prisma.iyzicoWebhookEvent.update({
      where: { eventKey },
      data: { processedAt: simdi },
    });

    return NextResponse.json({ ok: true });
  }

  // Abonelik iptal veya askıya alma
  if (
    eventType === "SUBSCRIPTION_CANCELED" ||
    eventType === "subscription.canceled" ||
    eventType === "SUBSCRIPTION_DEACTIVATED"
  ) {
    const subRef = ilkDoluString(data.subscriptionReferenceCode, data.referenceCode);
    if (!subRef) return NextResponse.json({ ok: true });

    const abonelik = await prisma.partnerAbonelik.findFirst({
      where: { iyzicoSubscriptionReferenceCode: subRef },
      orderBy: { createdAt: "desc" },
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

    await prisma.iyzicoWebhookEvent.update({
      where: { eventKey },
      data: { processedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
  } catch (err) {
    await prisma.iyzicoWebhookEvent.delete({ where: { eventKey } }).catch(() => null);
    console.error("[partner/webhook/iyzico] Event işlenemedi:", err);
    return NextResponse.json({ hata: "Webhook işlenemedi." }, { status: 500 });
  }
}
