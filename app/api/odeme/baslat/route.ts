import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";
import { ipIzinVer, ipAlNextRequest } from "@/lib/rate-limit";
import { davetiyeFiyatiHesapla } from "@/lib/davetiye-fiyatlandirma";

type FaturaBilgileri = {
  faturaTipi: "bireysel" | "kurumsal";
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
  const faturaTipi = fatura.faturaTipi === "kurumsal" ? "kurumsal" : "bireysel";
  const bilgiler: FaturaBilgileri = {
    faturaTipi,
    adSoyad: metinTemizle(fatura.adSoyad, 120),
    telefon: telefonNormalizeEt(fatura.telefon),
    kimlikVergiNo: metinTemizle(fatura.kimlikVergiNo, 20).replace(/\D/g, ""),
    sehir: metinTemizle(fatura.sehir, 60),
    adres: metinTemizle(fatura.adres, 300),
  };

  if (bilgiler.adSoyad.length < 3 || (faturaTipi === "bireysel" && !bilgiler.adSoyad.includes(" "))) {
    return { hata: "Fatura için ad ve soyad bilgisi gereklidir." };
  }
  if (!/^\+90\d{10}$/.test(bilgiler.telefon)) {
    return { hata: "Telefon numarasını +90 ile başlayan geçerli bir mobil numara olarak girin." };
  }
  if (faturaTipi === "kurumsal" && !/^\d{10,11}$/.test(bilgiler.kimlikVergiNo)) {
    return { hata: "T.C. kimlik veya vergi numarası 10 ya da 11 haneli olmalıdır." };
  }
  if (bilgiler.sehir.length < 2) {
    return { hata: "Fatura şehri gereklidir." };
  }
  if (faturaTipi === "kurumsal" && bilgiler.adres.length < 10) {
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

function tutarIyzicoMetni(tutar: number): string {
  return tutar.toFixed(2);
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
  const { davetiyeId, krediUygula } = body;

  if (typeof davetiyeId !== "string" || !davetiyeId) {
    return NextResponse.json(
      { hata: "Ödeme yalnızca oluşturulmuş bir davetiye için başlatılabilir." },
      { status: 400 },
    );
  }

  const davetiye = await prisma.davetiye.findFirst({
    where: { id: davetiyeId, userId: user.id },
    select: {
      id: true,
      slug: true,
      baslik: true,
      sablon: true,
      muzik: true,
      albumAktif: true,
      sesliAniAktif: true,
      canliDuvarAktif: true,
      oturmaPlanAktif: true,
      odemeDurumu: true,
    },
  });

  if (!davetiye) {
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  }

  if (davetiye?.odemeDurumu === "odendi") {
    return NextResponse.json({ hata: "Bu davetiye için ödeme zaten tamamlanmış." }, { status: 409 });
  }

  await prisma.siparis.updateMany({
    where: { davetiyeId: davetiye.id, durum: "odeme_bekliyor" },
    data: { durum: "iptal" },
  });

  const { bilgiler: faturaBilgileri, hata } = faturaBilgileriniOku(body);
  if (!faturaBilgileri) {
    return NextResponse.json({ hata }, { status: 400 });
  }

  const { ad, soyad } = adSoyadBol(faturaBilgileri.adSoyad);
  const kurumsalFatura = faturaBilgileri.faturaTipi === "kurumsal";
  const iyzicoKimlikNo = kurumsalFatura ? faturaBilgileri.kimlikVergiNo : "11111111111";
  const iyzicoAdres = kurumsalFatura
    ? faturaBilgileri.adres
    : `${faturaBilgileri.sehir} - Bireysel dijital hizmet alımı`;
  const fiyat = davetiyeFiyatiHesapla(davetiye);
  const referralIndirimi = (krediUygula === true && (user.referralKredi ?? 0) > 0)
    ? Math.min(user.referralKredi ?? 0, fiyat.toplamTutar)
    : 0;
  const toplamTutar = fiyat.toplamTutar - referralIndirimi;
  const siparis = await prisma.siparis.create({
    data: {
      userId: user.id,
      davetiyeId: davetiye.id,
      araToplam: fiyat.araToplam,
      toplamTutar: fiyat.toplamTutar,
      paraBirimi: fiyat.paraBirimi,
      fiyatKirilimi: fiyat as any,
    },
  });

  await prisma.davetiye.update({
    where: { id: davetiye.id },
    data: {
      odemeDurumu: "odeme_bekliyor",
      fiyatSnapshot: fiyat as any,
    },
  });

  const conversationId = `${user.id}-${davetiye.id}-${siparis.id}`;
  const basketId = siparis.id;
  const basketItems = fiyat.kalemler.map(kalem => ({
    id: kalem.kod,
    name: kalem.ad,
    category1: "Dijital Davetiye",
    itemType: "VIRTUAL",
    price: tutarIyzicoMetni(kalem.tutar),
  }));

  const request = {
    locale: "tr",
    conversationId,
    price: tutarIyzicoMetni(toplamTutar),
    paidPrice: tutarIyzicoMetni(toplamTutar),
    currency: "TRY",
    basketId,
    paymentGroup: "PRODUCT",
    callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/odeme/dogrula`,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: user.id,
      name: ad,
      surname: soyad,
      gsmNumber: faturaBilgileri.telefon,
      email: user.email!,
      identityNumber: iyzicoKimlikNo,
      registrationAddress: iyzicoAdres,
      ip: clientIp,
      city: faturaBilgileri.sehir,
      country: "Turkey",
    },
    shippingAddress: {
      contactName: faturaBilgileri.adSoyad,
      city: faturaBilgileri.sehir,
      country: "Turkey",
      address: iyzicoAdres,
    },
    billingAddress: {
      contactName: faturaBilgileri.adSoyad,
      city: faturaBilgileri.sehir,
      country: "Turkey",
      address: iyzicoAdres,
    },
    basketItems,
  };

  const result = await new Promise<any>((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request as any, (err: unknown, res: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  });

  if (result.status !== "success") {
    await prisma.siparis.update({
      where: { id: siparis.id },
      data: { durum: "baslatilamadi" },
    });
    return NextResponse.json({ hata: "Ödeme başlatılamadı." }, { status: 500 });
  }

  await prisma.siparis.update({
    where: { id: siparis.id },
    data: {
      odemeToken: result.token,
      conversationId,
    },
  });

  await prisma.odemeToken.create({
    data: {
      token:     result.token,
      userId:    user.id,
      planId:    "davetiye",
      urunTipi:  "davetiye",
      davetiyeId: davetiye.id,
      siparisId: siparis.id,
      toplamTutar,
      referralIndirimi,
      fiyatKirilimi: fiyat as any,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 saat
      aliciAdSoyad: faturaBilgileri.adSoyad,
      aliciTelefon: faturaBilgileri.telefon,
      aliciKimlikVergiNo: kurumsalFatura ? faturaBilgileri.kimlikVergiNo : null,
      aliciSehir: faturaBilgileri.sehir,
      aliciAdres: kurumsalFatura ? faturaBilgileri.adres : null,
    },
  });

  if (referralIndirimi > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { referralKredi: { decrement: referralIndirimi } },
    });
  }

  return NextResponse.json({
    checkoutFormContent: result.checkoutFormContent,
    token: result.token,
  });
}
