import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";
import { ipIzinVer, ipAlNextRequest } from "@/lib/rate-limit";

type FaturaBilgileri = {
  adSoyad: string;
  telefon: string;
  kimlikVergiNo: string;
  sehir: string;
  adres: string;
};

function metinTemizle(deger: unknown, max = 160): string {
  return typeof deger === "string" ? deger.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function telefonNormalizeEt(deger: unknown): string {
  const ham = typeof deger === "string" ? deger.trim() : "";
  const rakamlar = ham.replace(/\D/g, "");

  if (rakamlar.length === 10 && rakamlar.startsWith("5")) return `+90${rakamlar}`;
  if (rakamlar.length === 11 && rakamlar.startsWith("05")) return `+9${rakamlar}`;
  if (rakamlar.length === 12 && rakamlar.startsWith("90")) return `+${rakamlar}`;

  return ham.startsWith("+") ? ham.replace(/[^\d+]/g, "") : ham;
}

function faturaBilgileriniOku(body: any): { bilgiler?: FaturaBilgileri; hata?: string } {
  const fatura = body?.faturaBilgileri ?? {};
  const bilgiler: FaturaBilgileri = {
    adSoyad: metinTemizle(fatura.adSoyad, 120),
    telefon: telefonNormalizeEt(fatura.telefon),
    kimlikVergiNo: metinTemizle(fatura.kimlikVergiNo, 20).replace(/\D/g, ""),
    sehir: metinTemizle(fatura.sehir, 60),
    adres: metinTemizle(fatura.adres, 300),
  };

  if (bilgiler.adSoyad.length < 3 || !bilgiler.adSoyad.includes(" ")) {
    return { hata: "Fatura için ad ve soyad bilgisi gereklidir." };
  }
  if (!/^\+90\d{10}$/.test(bilgiler.telefon)) {
    return { hata: "Telefon numarasını +90 ile başlayan geçerli bir mobil numara olarak girin." };
  }
  if (!/^\d{10,11}$/.test(bilgiler.kimlikVergiNo)) {
    return { hata: "T.C. kimlik veya vergi numarası 10 ya da 11 haneli olmalıdır." };
  }
  if (bilgiler.sehir.length < 2) {
    return { hata: "Fatura şehri gereklidir." };
  }
  if (bilgiler.adres.length < 10) {
    return { hata: "Fatura adresi en az 10 karakter olmalıdır." };
  }

  return { bilgiler };
}

function adSoyadBol(adSoyad: string): { ad: string; soyad: string } {
  const parcalar = adSoyad.trim().split(/\s+/);
  return {
    ad: parcalar.slice(0, -1).join(" ") || parcalar[0] || "Ad",
    soyad: parcalar.at(-1) || "Soyad",
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. IP tabanlı limit: 5 deneme / 15 dk
  const clientIp = ipAlNextRequest(req);
  if (!(await ipIzinVer("odeme-ip", clientIp, 5, 15 * 60_000))) {
    return NextResponse.json(
      { hata: "Çok fazla ödeme isteği. Lütfen 15 dakika bekleyin." },
      { status: 429 },
    );
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  // 2. Kullanıcı tabanlı limit: 3 deneme / saat
  if (!(await ipIzinVer("odeme-kullanici", session.user.id, 3, 60 * 60_000))) {
    return NextResponse.json(
      { hata: "Saatlik ödeme deneme sınırına ulaşıldı. Lütfen bekleyin." },
      { status: 429 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const body = await req.json();
  const { planId } = body;

  const PLAN_FIYATLARI: Record<string, number> = { standart: 299, premium: 599 };
  const fiyat = PLAN_FIYATLARI[planId];
  if (!fiyat) {
    return NextResponse.json({ hata: "Geçersiz plan." }, { status: 400 });
  }

  const { bilgiler: faturaBilgileri, hata } = faturaBilgileriniOku(body);
  if (!faturaBilgileri) {
    return NextResponse.json({ hata }, { status: 400 });
  }

  const { ad, soyad } = adSoyadBol(faturaBilgileri.adSoyad);

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
      name: ad,
      surname: soyad,
      gsmNumber: faturaBilgileri.telefon,
      email: user.email!,
      identityNumber: faturaBilgileri.kimlikVergiNo,
      registrationAddress: faturaBilgileri.adres,
      ip: clientIp,
      city: faturaBilgileri.sehir,
      country: "Turkey",
    },
    shippingAddress: {
      contactName: faturaBilgileri.adSoyad,
      city: faturaBilgileri.sehir,
      country: "Turkey",
      address: faturaBilgileri.adres,
    },
    billingAddress: {
      contactName: faturaBilgileri.adSoyad,
      city: faturaBilgileri.sehir,
      country: "Turkey",
      address: faturaBilgileri.adres,
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
      aliciAdSoyad: faturaBilgileri.adSoyad,
      aliciTelefon: faturaBilgileri.telefon,
      aliciKimlikVergiNo: faturaBilgileri.kimlikVergiNo,
      aliciSehir: faturaBilgileri.sehir,
      aliciAdres: faturaBilgileri.adres,
    },
  });

  return NextResponse.json({
    checkoutFormContent: result.checkoutFormContent,
    token: result.token,
  });
}
