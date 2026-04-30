import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const { planId } = await req.json();

  const PLAN_FIYATLARI: Record<string, number> = { standart: 299, premium: 599 };
  const fiyat = PLAN_FIYATLARI[planId];
  if (!fiyat) {
    return NextResponse.json({ hata: "Geçersiz plan." }, { status: 400 });
  }

  // Gerçek istemci IP'sini al (proxy arkasında x-forwarded-for öncelikli)
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const request = {
    locale: "tr",
    conversationId: `${user.id}-${planId}-${Date.now()}`,
    price: String(fiyat),
    paidPrice: String(fiyat),
    currency: "TRY",
    basketId: `${user.id}-${planId}`,
    paymentGroup: "PRODUCT",
    callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/odeme/dogrula`,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: user.id,
      name: user.name?.split(" ")[0] || "Ad",
      surname: user.name?.split(" ").slice(1).join(" ") || "Soyad",
      // TODO (production): Kullanıcıdan telefon numarası toplanmalı
      gsmNumber: "+905350000000",
      email: user.email!,
      // Sandbox test değeri. TODO (production): iyzico canlıya geçişte
      // TC kimlik no toplamak KVKK kapsamında özel nitelikli veri sayılır;
      // iyzico'nun "11111111111" placeholder'ına production'da izin verip
      // vermediğini iyzico ile teyit et.
      identityNumber: "74300864791",
      registrationAddress: "Türkiye",
      ip: clientIp,
      city: "Istanbul",
      country: "Turkey",
    },
    shippingAddress: {
      contactName: user.name || "Kullanıcı",
      city: "Istanbul",
      country: "Turkey",
      address: "Türkiye",
    },
    billingAddress: {
      contactName: user.name || "Kullanıcı",
      city: "Istanbul",
      country: "Turkey",
      address: "Türkiye",
    },
    basketItems: [
      {
        id: planId,
        name: `Bekleriz ${planId} Planı`,
        category1: "Dijital Ürün",
        itemType: "VIRTUAL",
        price: String(fiyat),
      },
    ],
  };

  const result = await new Promise<any>((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request as any, (err: unknown, res: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  });

  if (result.status !== "success") {
    return NextResponse.json({ hata: "Ödeme başlatılamadı." }, { status: 500 });
  }

  await prisma.odemeToken.create({
    data: {
      token:     result.token,
      userId:    user.id,
      planId,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 saat
    },
  });

  return NextResponse.json({
    checkoutFormContent: result.checkoutFormContent,
    token: result.token,
  });
}