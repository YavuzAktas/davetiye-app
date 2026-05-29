import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";

const BASARISIZ = `${process.env.NEXT_PUBLIC_URL}/odeme/basarisiz`;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.formData();
  const token = body.get("token") as string;

  if (!token) {
    return NextResponse.redirect(BASARISIZ);
  }

  const result = await new Promise<any>((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({ token }, (err: unknown, res: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  });

  if (result.status !== "success" || result.paymentStatus !== "SUCCESS") {
    return new NextResponse(null, {
      status: 302,
      headers: { Location: BASARISIZ },
    });
  }

  // API yanıtının HMAC-SHA256 imzasını doğrula (varsa).
  // Alanlar: paymentStatus:paymentId:currency:basketId:conversationId:paidPrice:price:token
  if (result.signature) {
    const expected = createHmac("sha256", process.env.IYZICO_SECRET_KEY ?? "")
      .update([
        result.paymentStatus,
        result.paymentId,
        result.currency,
        result.basketId,
        result.conversationId,
        result.paidPrice,
        result.price,
        result.token,
      ].join(":"))
      .digest("hex");
    if (expected !== result.signature) {
      return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
    }
  }

  // Atomik: token kullanılmamışsa işaretle ve davetiyeyi güncelle.
  // updateMany, "kullanildi:false" koşuluyla atomik çalışır;
  // eşzamanlı iki istek aynı token'ı ikinci kez aktive edemez.
  const odemeToken = await prisma.odemeToken.findUnique({
    where: { token },
    select: {
      userId: true,
      planId: true,
      urunTipi: true,
      davetiyeId: true,
      siparisId: true,
      fiyatKirilimi: true,
      kullanildi: true,
      expiresAt: true,
      aliciAdSoyad: true,
      aliciTelefon: true,
      aliciKimlikVergiNo: true,
      aliciSehir: true,
      aliciAdres: true,
      user: { select: { email: true } },
      davetiye: { select: { slug: true } },
    },
  });

  if (!odemeToken || odemeToken.expiresAt < new Date()) {
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  if (odemeToken.urunTipi !== "davetiye" || !odemeToken.davetiyeId || !odemeToken.siparisId) {
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  const guncellendi = await prisma.odemeToken.updateMany({
    where: { token, kullanildi: false },
    data: { kullanildi: true },
  });

  if (guncellendi.count === 0) {
    // Token zaten kullanılmış — race condition veya tekrar istek
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  await prisma.$transaction([
    prisma.siparis.update({
      where: { id: odemeToken.siparisId },
      data: {
        durum: "odendi",
        paymentId: result.paymentId ? String(result.paymentId) : null,
        conversationId: result.conversationId ? String(result.conversationId) : null,
        paidAt: new Date(),
      },
    }),
    prisma.davetiye.update({
      where: { id: odemeToken.davetiyeId },
      data: {
        odemeDurumu: "odendi",
        aktif: true,
        fiyatSnapshot: odemeToken.fiyatKirilimi as any,
      },
    }),
  ]);

  // Referral ödülü: bu kullanıcı birisinin referralıyla geldiyse ve
  // daha önce ödüllendirilmediyse referrer'a 50₺ kredi ekle.
  const referral = await prisma.referral.findUnique({
    where: { referredId: odemeToken.userId },
    select: { id: true, odendi: true, referrerId: true, tutar: true },
  });
  if (referral && !referral.odendi) {
    await prisma.$transaction([
      prisma.referral.update({
        where: { id: referral.id },
        data: { odendi: true },
      }),
      prisma.user.update({
        where: { id: referral.referrerId },
        data: { referralKredi: { increment: referral.tutar } },
      }),
    ]);
  }

  await prisma.odemeKaydi.create({
    data: {
      userId: odemeToken.userId,
      userEmail: odemeToken.user.email,
      planId: odemeToken.planId,
      urunTipi: odemeToken.urunTipi,
      davetiyeId: odemeToken.davetiyeId,
      siparisId: odemeToken.siparisId,
      fiyatKirilimi: odemeToken.fiyatKirilimi as any,
      token,
      paymentId: result.paymentId ? String(result.paymentId) : null,
      conversationId: result.conversationId ? String(result.conversationId) : null,
      price: result.price ? String(result.price) : null,
      paidPrice: result.paidPrice ? String(result.paidPrice) : null,
      currency: result.currency ? String(result.currency) : "TRY",
      paymentStatus: result.paymentStatus ? String(result.paymentStatus) : null,
      aliciAdSoyad: odemeToken.aliciAdSoyad,
      aliciTelefon: odemeToken.aliciTelefon,
      aliciKimlikVergiNo: odemeToken.aliciKimlikVergiNo,
      aliciSehir: odemeToken.aliciSehir,
      aliciAdres: odemeToken.aliciAdres,
    },
  });

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: `${process.env.NEXT_PUBLIC_URL}/odeme/basarili?urun=davetiye&slug=${odemeToken.davetiye?.slug ?? ""}`,
    },
  });
}
