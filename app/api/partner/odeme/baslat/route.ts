import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";
import { ipIzinVer, ipAlNextRequest } from "@/lib/rate-limit";
import { paketGetir } from "@/lib/partner-paketler";
import {
  PARTNER_ABONELIK_PLAN_ENV_KEYS,
  partnerAbonelikPlanReferenceCodeGetir,
} from "@/lib/partner-abonelik-planlari";
import { getSiteUrl } from "@/lib/site-url";

function temizle(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function telefonNormalize(v: unknown): string {
  const ham = typeof v === "string" ? v.trim() : "";
  const r = ham.replace(/\D/g, "");
  if (r.length === 10 && r.startsWith("5")) return `+90${r}`;
  if (r.length === 11 && r.startsWith("05")) return `+9${r}`;
  if (r.length === 12 && r.startsWith("90")) return `+${r}`;
  return ham.startsWith("+") ? ham.replace(/[^\d+]/g, "") : ham;
}

function adSoyadBol(adSoyad: string) {
  const p = adSoyad.trim().split(/\s+/);
  return { ad: p.slice(0, -1).join(" ") || p[0] || "Ad", soyad: p.at(-1) || "Soyad" };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const clientIp = ipAlNextRequest(req);
  if (!(await ipIzinVer("partner-odeme-ip", clientIp, 5, 15 * 60_000))) {
    return NextResponse.json({ hata: "Çok fazla istek. 15 dakika bekleyin." }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  if (!(await ipIzinVer("partner-odeme-kullanici", session.user.id, 20, 60 * 60_000))) {
    return NextResponse.json({ hata: "Saatlik deneme sınırına ulaşıldı." }, { status: 429 });
  }

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    select: { id: true, firmaAdi: true, durum: true },
  });

  if (!partner || partner.durum !== "aktif") {
    return NextResponse.json({ hata: "Aktif partner hesabı gerekli." }, { status: 403 });
  }

  const aktifAbonelik = await prisma.partnerAbonelik.findFirst({
    where: {
      partnerId: partner.id,
      aktif: true,
      OR: [{ bitisAt: null }, { bitisAt: { gt: new Date() } }],
    },
    select: { bitisAt: true, kullanilanHak: true, hakSayisi: true },
  });
  if (aktifAbonelik) {
    const besGunSonra = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const erkenYenileIzin =
      (aktifAbonelik.bitisAt !== null && aktifAbonelik.bitisAt < besGunSonra) ||
      aktifAbonelik.kullanilanHak >= aktifAbonelik.hakSayisi;
    if (!erkenYenileIzin) {
      const bitisStr = aktifAbonelik.bitisAt
        ? new Date(aktifAbonelik.bitisAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
        : null;
      return NextResponse.json({
        hata: bitisStr
          ? `Aktif aboneliğiniz ${bitisStr} tarihine kadar geçerli. Bu tarihten sonra yeni paket alabilirsiniz.`
          : "Aktif aboneliğiniz bulunuyor. Sona erdikten sonra yeni paket alabilirsiniz.",
      }, { status: 409 });
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true },
  });
  if (!user) return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const paketId = temizle(body.paketId, 30);
  const paket = paketGetir(paketId);
  if (!paket) return NextResponse.json({ hata: "Geçersiz paket." }, { status: 400 });

  const fb = body.faturaBilgileri ?? {};
  const faturaTipi: "bireysel" | "kurumsal" = fb.faturaTipi === "kurumsal" ? "kurumsal" : "bireysel";
  const adSoyad = temizle(fb.adSoyad, 120);
  const telefon = telefonNormalize(fb.telefon);
  const sehir = temizle(fb.sehir, 60);
  const kimlikVergiNo = temizle(fb.kimlikVergiNo, 20).replace(/\D/g, "");
  const adres = temizle(fb.adres, 300);
  const kurumsal = faturaTipi === "kurumsal";

  if (adSoyad.length < 3) return NextResponse.json({ hata: "Ad soyad gerekli." }, { status: 400 });
  if (!/^\+90\d{10}$/.test(telefon)) return NextResponse.json({ hata: "Geçerli telefon girin." }, { status: 400 });
  if (sehir.length < 2) return NextResponse.json({ hata: "Şehir gerekli." }, { status: 400 });
  if (kurumsal && !/^\d{10,11}$/.test(kimlikVergiNo)) return NextResponse.json({ hata: "Vergi/kimlik no hatalı." }, { status: 400 });
  if (kurumsal && adres.length < 10) return NextResponse.json({ hata: "Fatura adresi gerekli." }, { status: 400 });

  const iyzicoKimlikNo = kurumsal ? kimlikVergiNo : "11111111111";
  const iyzicoAdres = kurumsal ? adres : `${sehir} - Bireysel dijital hizmet alımı`;
  const { ad, soyad } = adSoyadBol(adSoyad);
  const tutar = paket.aylikTutar;
  const conversationId = `partner-${partner.id}-${paketId}-${Date.now()}`;

  const pricingPlanReferenceCode = partnerAbonelikPlanReferenceCodeGetir(paketId);
  if (!pricingPlanReferenceCode) {
    const envKey = PARTNER_ABONELIK_PLAN_ENV_KEYS[paketId as keyof typeof PARTNER_ABONELIK_PLAN_ENV_KEYS];
    console.error(`[partner/odeme/baslat] Eksik env var: ${envKey ?? paketId}`);
    return NextResponse.json({ hata: "Ödeme planı tanımlanmamış." }, { status: 503 });
  }

  const callbackUrl = `${getSiteUrl()}/api/partner/odeme/dogrula`;

  const result = await new Promise<any>((resolve, reject) => {
    (iyzipay as any).subscriptionCheckoutForm.initialize({
      locale: "tr",
      conversationId,
      callbackUrl,
      pricingPlanReferenceCode,
      subscriptionInitialStatus: "ACTIVE",
      customer: {
        name: ad,
        surname: soyad,
        identityNumber: iyzicoKimlikNo,
        email: user.email!,
        gsmNumber: telefon,
        billingAddress: { contactName: adSoyad, address: iyzicoAdres, city: sehir, country: "Turkey", district: "" },
        shippingAddress: { contactName: adSoyad, address: iyzicoAdres, city: sehir, country: "Turkey", district: "" },
      },
    }, (err: unknown, res: any) => {
      if (err) reject(err); else resolve(res);
    });
  }).catch((err: unknown) => {
    console.error("[partner/odeme/baslat] iyzipay hatası:", err);
    return null;
  });

  if (!result) {
    return NextResponse.json({ hata: "Ödeme servisiyle iletişim kurulamadı." }, { status: 502 });
  }

  if (result.status !== "success") {
    console.error("[partner/odeme/baslat] iyzipay başarısız:", JSON.stringify(result));
    return NextResponse.json({ hata: result.errorMessage ?? "Ödeme başlatılamadı." }, { status: 500 });
  }

  const checkoutToken: string = result.checkoutFormToken ?? result.token;
  if (!checkoutToken) {
    return NextResponse.json({ hata: "Ödeme token alınamadı." }, { status: 500 });
  }

  await prisma.odemeToken.create({
    data: {
      token: checkoutToken,
      userId: user.id,
      planId: paketId,
      urunTipi: "partner-paket",
      toplamTutar: tutar,
      fiyatKirilimi: { paketId, paketAd: paket.ad, tutar, hakSayisi: paket.hakSayisi },
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      aliciAdSoyad: adSoyad,
      aliciTelefon: telefon,
      aliciKimlikVergiNo: kurumsal ? kimlikVergiNo : null,
      aliciSehir: sehir,
      aliciAdres: kurumsal ? adres : null,
    },
  });

  return NextResponse.json({ checkoutFormContent: result.checkoutFormContent, token: checkoutToken });
}
