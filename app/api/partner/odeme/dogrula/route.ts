import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";
import { paketGetir } from "@/lib/partner-paketler";
import { getSiteUrl } from "@/lib/site-url";

const PANEL_URL = `${getSiteUrl()}/partner/panel`;
const BASARISIZ = `${getSiteUrl()}/partner/panel?odeme=basarisiz`;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.formData();
  const token = (body.get("token") ?? body.get("checkoutFormToken")) as string | null;
  if (!token) return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });

  // Önce subscription retrieve dene, başarısız olursa tek seferlik retrieve'e fallback
  let result = await new Promise<any>((resolve, reject) => {
    (iyzipay as any).subscriptionCheckoutForm.retrieve({ checkoutFormToken: token }, (err: unknown, res: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  }).catch(() => null);

  let tekSeferlik = false;
  if (!result || result.status !== "success") {
    result = await new Promise<any>((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({ token } as any, (err: unknown, res: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    }).catch(() => null);
    tekSeferlik = true;
  }

  if (!result || result.status !== "success") {
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  if (tekSeferlik && result.paymentStatus !== "SUCCESS") {
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  const subscriptionReferenceCode: string | null = tekSeferlik ? null : (result.subscriptionReferenceCode ?? result.data?.subscriptionReferenceCode ?? null);
  const customerReferenceCode: string | null = tekSeferlik ? null : (result.customerReferenceCode ?? result.data?.customerReferenceCode ?? null);
  const pricingPlanReferenceCode: string | null = tekSeferlik ? null : (result.pricingPlanReferenceCode ?? result.data?.pricingPlanReferenceCode ?? null);
  const sonrakiTahsilatAt: Date | null = (() => {
    if (tekSeferlik) return null;
    const raw = result.nextPaymentDate ?? result.data?.nextPaymentDate ?? null;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  })();

  const odemeToken = await prisma.odemeToken.findUnique({
    where: { token },
    select: {
      userId: true,
      planId: true,
      urunTipi: true,
      fiyatKirilimi: true,
      kullanildi: true,
      expiresAt: true,
      toplamTutar: true,
      aliciAdSoyad: true,
      aliciTelefon: true,
      aliciKimlikVergiNo: true,
      aliciSehir: true,
      aliciAdres: true,
      user: { select: { email: true } },
    },
  });

  if (!odemeToken || odemeToken.kullanildi || odemeToken.expiresAt < new Date()) {
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  if (odemeToken.urunTipi !== "partner-paket") {
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  const paket = paketGetir(odemeToken.planId);
  if (!paket) return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });

  const partner = await prisma.partner.findUnique({
    where: { userId: odemeToken.userId },
    select: { id: true },
  });
  if (!partner) return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });

  // Atomik: token kullanılmamışsa işaretle
  const guncellenen = await prisma.odemeToken.updateMany({
    where: { token, kullanildi: false },
    data: { kullanildi: true },
  });
  if (guncellenen.count === 0) {
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  const simdi = new Date();
  // bitisAt = sonraki tahsilat tarihi veya fallback 30 gün
  const bitisAt = sonrakiTahsilatAt ?? new Date(simdi.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    // Mevcut aktif aboneliği kapat
    prisma.partnerAbonelik.updateMany({
      where: { partnerId: partner.id, aktif: true },
      data: { aktif: false },
    }),
    // Yeni abonelik oluştur
    prisma.partnerAbonelik.create({
      data: {
        partnerId: partner.id,
        paketId: paket.id,
        hakSayisi: paket.hakSayisi,
        kullanilanHak: 0,
        baslangicAt: simdi,
        bitisAt,
        aktif: true,
        otomatikYenileme: !!subscriptionReferenceCode,
        abonelikDurumu: subscriptionReferenceCode ? "aktif" : "manuel",
        iyzicoSubscriptionReferenceCode: subscriptionReferenceCode,
        iyzicoCustomerReferenceCode: customerReferenceCode,
        iyzicoPricingPlanReferenceCode: pricingPlanReferenceCode,
        sonTahsilatAt: simdi,
        sonrakiTahsilatAt: sonrakiTahsilatAt,
      },
    }),
  ]);

  const fk = odemeToken.fiyatKirilimi as { tutar?: number } | null;
  const paketTutar = fk?.tutar ?? paket.aylikTutar;

  await prisma.odemeKaydi.create({
    data: {
      userId: odemeToken.userId,
      userEmail: odemeToken.user.email,
      planId: odemeToken.planId,
      urunTipi: "partner-paket",
      fiyatKirilimi: odemeToken.fiyatKirilimi as any,
      token,
      paymentId: result.paymentId ? String(result.paymentId) : subscriptionReferenceCode,
      conversationId: result.conversationId ? String(result.conversationId) : null,
      price: String(paketTutar),
      paidPrice: String(paketTutar),
      currency: "TRY",
      paymentStatus: "SUCCESS",
      aliciAdSoyad: odemeToken.aliciAdSoyad,
      aliciTelefon: odemeToken.aliciTelefon,
      aliciKimlikVergiNo: odemeToken.aliciKimlikVergiNo,
      aliciSehir: odemeToken.aliciSehir,
      aliciAdres: odemeToken.aliciAdres,
    },
  });

  return new NextResponse(null, {
    status: 302,
    headers: { Location: `${PANEL_URL}?odeme=basarili` },
  });
}
