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

  const { planId, fiyat } = await req.json();

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
      gsmNumber: "+905000000000",
      email: user.email!,
      identityNumber: "11111111111",
      registrationAddress: "Türkiye",
      ip: "85.34.78.112",
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
        name: `Davetim ${planId} Planı`,
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