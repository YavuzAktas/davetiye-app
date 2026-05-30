import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";
import { ipIzinVer, ipAlNextRequest } from "@/lib/rate-limit";
import { yasalOnayKaydiOlustur } from "@/lib/yasal-onay-kaydi";
import { isAdmin } from "@/lib/admin";

// Satın alınabilir ek özelliklerin sabit fiyatları
const OZELLIK_FIYAT: Record<string, { kod: string; ad: string; tutar: number }> = {
  checkInAktif:    { kod: "qr-check-in",    ad: "QR Check-in",             tutar: 99  },
  oturmaPlanAktif: { kod: "oturma-plani",   ad: "Oturma planı",            tutar: 199 },
  albumAktif:      { kod: "album-foto",     ad: "Fotoğraf albümü",         tutar: 99  },
  aniDefteriAktif: { kod: "ani-defteri",    ad: "Anı defteri",             tutar: 99  },
  sesliAniAktif:   { kod: "sesli-ani",      ad: "Sesli anı defteri",       tutar: 99  },
  canliDuvarAktif: { kod: "canli-duvar",    ad: "Canlı fotoğraf duvarı",   tutar: 99  },
  aniKitabiAktif:  { kod: "ani-kitabi-pdf", ad: "Anı Kitabı PDF",          tutar: 79  },
};

const GECERLI_ALANLAR = new Set(Object.keys(OZELLIK_FIYAT));

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
  const clientIp = ipAlNextRequest(req);
  if (!(await ipIzinVer("odeme-ip", clientIp, 5, 15 * 60_000))) {
    return NextResponse.json({ hata: "Çok fazla ödeme isteği. Lütfen 15 dakika bekleyin." }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  if (!isAdmin(session.user.email)) {
    return NextResponse.json({ hata: "Ödeme sistemi henüz aktif değil. Çok yakında hizmetinize sunulacak." }, { status: 503 });
  }

  if (!(await ipIzinVer("odeme-kullanici", session.user.id, 3, 60 * 60_000))) {
    return NextResponse.json({ hata: "Saatlik ödeme deneme sınırına ulaşıldı." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });

  const { davetiyeId, ozellikler, faturaBilgileri: fatura } = body;

  if (typeof davetiyeId !== "string" || !davetiyeId) {
    return NextResponse.json({ hata: "davetiyeId gerekli." }, { status: 400 });
  }
  if (!Array.isArray(ozellikler) || ozellikler.length === 0) {
    return NextResponse.json({ hata: "En az bir özellik seçmelisiniz." }, { status: 400 });
  }

  // Sadece geçerli alan adlarına izin ver
  const temizOzellikler: string[] = ozellikler.filter(
    (o: unknown) => typeof o === "string" && GECERLI_ALANLAR.has(o)
  );
  if (temizOzellikler.length === 0) {
    return NextResponse.json({ hata: "Geçerli özellik seçilmedi." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true },
  });
  if (!user) return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });

  const davetiye = await prisma.davetiye.findFirst({
    where: { id: davetiyeId, userId: user.id },
    select: {
      id: true, slug: true, baslik: true, odemeDurumu: true,
      checkInAktif: true, oturmaPlanAktif: true, albumAktif: true,
      aniDefteriAktif: true, sesliAniAktif: true, canliDuvarAktif: true, aniKitabiAktif: true,
    },
  });

  if (!davetiye) return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  if (davetiye.odemeDurumu !== "odendi") {
    return NextResponse.json({ hata: "Ek özellik yalnızca ödemesi tamamlanan davetiyeler için satın alınabilir." }, { status: 409 });
  }

  // Zaten aktif olan özellikleri filtrele
  const zatenAktif = temizOzellikler.filter(
    alan => davetiye[alan as keyof typeof davetiye] === true
  );
  if (zatenAktif.length > 0) {
    return NextResponse.json({ hata: `Bu özellik zaten aktif: ${zatenAktif.join(", ")}` }, { status: 409 });
  }

  // Fatura doğrulama
  const f = fatura ?? {};
  const faturaTipi: "bireysel" | "kurumsal" = f.faturaTipi === "kurumsal" ? "kurumsal" : "bireysel";
  const adSoyad = metinTemizle(f.adSoyad, 120);
  const telefon = telefonNormalizeEt(f.telefon);
  const sehir = metinTemizle(f.sehir, 60);
  const kimlikVergiNo = metinTemizle(f.kimlikVergiNo, 20).replace(/\D/g, "");
  const adres = metinTemizle(f.adres, 300);
  const kurumsal = faturaTipi === "kurumsal";

  if (adSoyad.length < 3 || (!kurumsal && !adSoyad.includes(" "))) {
    return NextResponse.json({ hata: "Fatura için ad ve soyad bilgisi gereklidir." }, { status: 400 });
  }
  if (!/^\+90\d{10}$/.test(telefon)) {
    return NextResponse.json({ hata: "Telefon numarasını +90 ile başlayan geçerli bir mobil numara olarak girin." }, { status: 400 });
  }
  if (sehir.length < 2) {
    return NextResponse.json({ hata: "Fatura şehri gereklidir." }, { status: 400 });
  }
  if (kurumsal && !/^\d{10,11}$/.test(kimlikVergiNo)) {
    return NextResponse.json({ hata: "T.C. kimlik veya vergi numarası 10 ya da 11 haneli olmalıdır." }, { status: 400 });
  }
  if (kurumsal && adres.length < 10) {
    return NextResponse.json({ hata: "Fatura adresi en az 10 karakter olmalıdır." }, { status: 400 });
  }

  const { ad, soyad } = adSoyadBol(adSoyad);
  const iyzicoKimlikNo = kurumsal ? kimlikVergiNo : "11111111111";
  const iyzicoAdres = kurumsal ? adres : `${sehir} - Bireysel dijital hizmet alımı`;

  // Fiyat hesapla
  const kalemler = temizOzellikler.map(alan => ({ ...OZELLIK_FIYAT[alan] }));
  const toplamTutar = kalemler.reduce((acc, k) => acc + k.tutar, 0);
  const fiyatKirilimi = {
    paraBirimi: "TRY" as const,
    araToplam: toplamTutar,
    toplamTutar,
    kalemler,
    eklenecekOzellikler: temizOzellikler,
  };

  // Önceki bekleyen siparişleri iptal et
  await prisma.siparis.updateMany({
    where: { davetiyeId: davetiye.id, durum: "odeme_bekliyor" },
    data: { durum: "iptal" },
  });

  const siparis = await prisma.siparis.create({
    data: {
      userId: user.id,
      davetiyeId: davetiye.id,
      araToplam: toplamTutar,
      toplamTutar,
      paraBirimi: "TRY",
      fiyatKirilimi: fiyatKirilimi as any,
    },
  });

  await yasalOnayKaydiOlustur({
    userId: user.id,
    davetiyeId: davetiye.id,
    siparisId: siparis.id,
    email: user.email,
    onayTipi: "odeme-on-bilgilendirme-mesafeli-satis-ve-cayma-istisnasi",
    kaynak: "ek-ozellik-odeme-baslat",
  });

  const conversationId = `${user.id}-${davetiye.id}-${siparis.id}`;

  const request = {
    locale: "tr",
    conversationId,
    price: tutarIyzicoMetni(toplamTutar),
    paidPrice: tutarIyzicoMetni(toplamTutar),
    currency: "TRY",
    basketId: siparis.id,
    paymentGroup: "PRODUCT",
    callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/odeme/dogrula`,
    enabledInstallments: [1, 2, 3],
    buyer: {
      id: user.id,
      name: ad,
      surname: soyad,
      gsmNumber: telefon,
      email: user.email!,
      identityNumber: iyzicoKimlikNo,
      registrationAddress: iyzicoAdres,
      ip: clientIp,
      city: sehir,
      country: "Turkey",
    },
    shippingAddress: { contactName: adSoyad, city: sehir, country: "Turkey", address: iyzicoAdres },
    billingAddress:  { contactName: adSoyad, city: sehir, country: "Turkey", address: iyzicoAdres },
    basketItems: kalemler.map(k => ({
      id: k.kod,
      name: k.ad,
      category1: "Dijital Davetiye",
      itemType: "VIRTUAL",
      price: tutarIyzicoMetni(k.tutar),
    })),
  };

  const result = await new Promise<any>((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request as any, (err: unknown, res: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  });

  if (result.status !== "success") {
    await prisma.siparis.update({ where: { id: siparis.id }, data: { durum: "baslatilamadi" } });
    return NextResponse.json({ hata: "Ödeme başlatılamadı." }, { status: 500 });
  }

  await prisma.odemeToken.create({
    data: {
      token:          result.token,
      userId:         user.id,
      planId:         "ek-ozellik",
      urunTipi:       "ek-ozellik",
      davetiyeId:     davetiye.id,
      siparisId:      siparis.id,
      toplamTutar,
      referralIndirimi: 0,
      fiyatKirilimi:  fiyatKirilimi as any,
      expiresAt:      new Date(Date.now() + 2 * 60 * 60 * 1000),
      aliciAdSoyad:   adSoyad,
      aliciTelefon:   telefon,
      aliciKimlikVergiNo: kurumsal ? kimlikVergiNo : null,
      aliciSehir:     sehir,
      aliciAdres:     kurumsal ? adres : null,
    },
  });

  await prisma.siparis.update({
    where: { id: siparis.id },
    data: { odemeToken: result.token, conversationId },
  });

  return NextResponse.json({ checkoutFormContent: result.checkoutFormContent, token: result.token });
}
