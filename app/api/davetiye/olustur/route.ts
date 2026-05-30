import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { davetiyeFiyatiHesapla } from "@/lib/davetiye-fiyatlandirma";
import { ipIzinVer } from "@/lib/rate-limit";
import { SABLONLAR } from "@/lib/sablonlar";
import { MUZIK_KUTUPHANESI } from "@/lib/muzik-kutuphanesi";
import { davetiyeYayindaBildir } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";

const SABLON_IDLERI = new Set(SABLONLAR.map((s) => s.id));
const MUZIK_URLLERI = new Set(MUZIK_KUTUPHANESI.map((m) => m.url));
const FONT_IDLERI = new Set(["font-sans", "font-serif", "font-mono"]);
const RSVP_SORU_IDLERI = ["sarki", "yemek", "ulasim", "cocuk", "alerji", "ozel"] as const;
const HEX_RENK = /^#[0-9a-fA-F]{6}$/;
const TARIH_DESENI = /^\d{4}-\d{2}-\d{2}$/;
const SAAT_DESENI = /^([01]\d|2[0-3]):[0-5]\d$/;

const opsiyonelMetin = (max: number) =>
  z.string().trim().max(max).optional().nullable().transform((v) => v || null);

const rsvpSoruSemasi = z.object({
  id: z.enum(RSVP_SORU_IDLERI),
  aktif: z.boolean(),
  soru: z.string().trim().max(200).optional(),
});

const davetiyeOlusturSemasi = z.object({
  baslik: z.string().trim().min(1).max(160),
  etkinlikTur: z.string().trim().min(1).max(40),
  tarih: z.string().trim().regex(TARIH_DESENI),
  saat: z.string().trim().regex(SAAT_DESENI).optional().or(z.literal("")).transform((v) => v || null),
  mekan: z.string().trim().min(1).max(300),
  mesaj: opsiyonelMetin(1000),
  sablon: z.string().trim().refine((v) => SABLON_IDLERI.has(v), "Geçersiz şablon."),
  font: z.string().trim().optional().nullable().transform((v) => FONT_IDLERI.has(v || "") ? v! : "font-sans"),
  renk: z.string().trim().regex(HEX_RENK).optional().nullable().transform((v) => v || null),
  kisi1: opsiyonelMetin(120),
  kisi2: opsiyonelMetin(120),
  muzik: z.string().trim().optional().nullable().transform((v) => v || null)
    .refine((v) => !v || MUZIK_URLLERI.has(v), "Geçersiz müzik seçimi."),
  polaroid1: z.string().trim().url().max(500).optional().nullable().transform((v) => v || null),
  polaroid2: z.string().trim().url().max(500).optional().nullable().transform((v) => v || null),
  polaroid3: z.string().trim().url().max(500).optional().nullable().transform((v) => v || null),
  sesliAniAktif: z.boolean().optional().default(false),
  canliDuvarAktif: z.boolean().optional().default(false),
  aniDefteriAktif: z.boolean().optional().default(false),
  oturmaPlanAktif: z.boolean().optional().default(false),
  albumAktif: z.boolean().optional().default(false),
  aniKitabiAktif: z.boolean().optional().default(false),
  checkInAktif:   z.boolean().optional().default(false),
  dressKod: opsiyonelMetin(80),
  dressKodRenkler: z.string().trim().max(300).optional().nullable().transform((v) => v || null)
    .refine((v) => {
      if (!v) return true;
      try {
        const parsed = JSON.parse(v);
        return Array.isArray(parsed) && parsed.length <= 5 && parsed.every((renk) => typeof renk === "string" && HEX_RENK.test(renk));
      } catch {
        return false;
      }
    }, "Geçersiz dress code renkleri."),
  rsvpSorular: z.array(rsvpSoruSemasi).max(6).optional().nullable()
    .refine((sorular) => {
      if (!sorular) return true;
      return new Set(sorular.map((s) => s.id)).size === sorular.length;
    }, "RSVP soruları tekrar edemez.")
    .transform((v) => v || undefined),
  aktivasyonKodu: z.string().trim().max(30).optional().nullable().transform((v) => v || null),
}).strict();

function tarihSaatOlustur(tarih: string, saat: string | null) {
  const tarihSaat = saat ? new Date(`${tarih}T${saat}:00`) : new Date(`${tarih}T00:00:00`);
  return Number.isNaN(tarihSaat.getTime()) ? null : tarihSaat;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  // Kullanıcı başına günlük 10 davetiye oluşturma limiti.
  if (!(await ipIzinVer("davetiye-olustur", session.user.id, 10, 24 * 60 * 60_000))) {
    return NextResponse.json({ hata: "Günlük davetiye oluşturma limitine ulaştınız." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const sonuc = davetiyeOlusturSemasi.safeParse(body);
  if (!sonuc.success) {
    return NextResponse.json({ hata: "Davetiye bilgileri geçersiz veya eksik." }, { status: 400 });
  }
  const veri = sonuc.data;
  const tarihSaat = tarihSaatOlustur(veri.tarih, veri.saat);
  if (!tarihSaat) return NextResponse.json({ hata: "Geçersiz etkinlik tarihi." }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const kullanilanPolaroidler = [...new Set([veri.polaroid1, veri.polaroid2, veri.polaroid3].filter(Boolean))] as string[];
  if (kullanilanPolaroidler.length > 0) {
    const sahipOlunanYuklemeler = await prisma.geciciYukleme.findMany({
      where: {
        userId: user.id,
        dosyaUrl: { in: kullanilanPolaroidler },
        kullanildi: false,
      },
      select: { dosyaUrl: true },
    });
    if (sahipOlunanYuklemeler.length !== kullanilanPolaroidler.length) {
      return NextResponse.json({ hata: "Geçersiz veya süresi dolmuş görsel yüklemesi." }, { status: 400 });
    }
  }

  let aktivasyonKoduKayit: {
    id: string;
    partner: { firmaAdi: string; user: { email: string | null } };
  } | null = null;

  const slug = nanoid(10);
  const fiyat = davetiyeFiyatiHesapla({
    sablon: veri.sablon,
    muzik: veri.muzik,
    albumAktif: veri.albumAktif,
    aniDefteriAktif: veri.aniDefteriAktif,
    sesliAniAktif: veri.sesliAniAktif,
    canliDuvarAktif: veri.canliDuvarAktif,
    oturmaPlanAktif: veri.oturmaPlanAktif,
    aniKitabiAktif:  veri.aniKitabiAktif,
    checkInAktif:    veri.checkInAktif,
  });

  const davetiyeVerisi = {
    slug,
    baslik: veri.baslik,
    etkinlikTur: veri.etkinlikTur,
    tarih:           tarihSaat,
    mekan:           veri.mekan,
    mesaj:           veri.mesaj,
    sablon:          veri.sablon,
    font:            veri.font,
    ozelRenk:        veri.renk,
    muzik:           veri.muzik,
    userId:          user.id,
    kisi1:           veri.kisi1,
    kisi2:           veri.kisi2,
    polaroid1:       veri.polaroid1,
    polaroid2:       veri.polaroid2,
    polaroid3:       veri.polaroid3,
    sesliAniAktif:   veri.sesliAniAktif,
    canliDuvarAktif: veri.canliDuvarAktif,
    aniDefteriAktif: veri.aniDefteriAktif,
    oturmaPlanAktif: veri.oturmaPlanAktif,
    dressKod:        veri.dressKod,
    dressKodRenkler: veri.dressKodRenkler,
    albumAktif:      veri.albumAktif,
    aniKitabiAktif:  veri.aniKitabiAktif,
    checkInAktif:    veri.checkInAktif,
    rsvpSorular:     veri.rsvpSorular,
    fiyatSnapshot:   fiyat as any,
  };

  let davetiye: { id: string; slug: string };

  if (veri.aktivasyonKodu) {
    const aktivasyonluOlusturma = await prisma.$transaction(async (tx) => {
      const rezervasyon = await tx.aktivasyonKodu.updateMany({
        where: {
          kod: veri.aktivasyonKodu!,
          musteriUserId: user.id,
          durum: "kayit_oldu",
          davetiyeId: null,
        },
        data: { durum: "davetiye_olusturuluyor" },
      });

      if (rezervasyon.count !== 1) return null;

      const aktivasyon = await tx.aktivasyonKodu.findUnique({
        where: { kod: veri.aktivasyonKodu! },
        select: {
          id: true,
          partner: { select: { firmaAdi: true, user: { select: { email: true } } } },
        },
      });

      if (!aktivasyon) return null;

      const yeniDavetiye = await tx.davetiye.create({
        data: {
          ...davetiyeVerisi,
          odemeDurumu: "odendi",
          aktif: true,
        },
        select: { id: true, slug: true },
      });

      await tx.aktivasyonKodu.update({
        where: { id: aktivasyon.id },
        data: { davetiyeId: yeniDavetiye.id, durum: "yayinda" },
      });

      return { davetiye: yeniDavetiye, aktivasyon };
    });

    if (!aktivasyonluOlusturma) {
      return NextResponse.json(
        { hata: "Aktivasyon linki geçersiz, süresi dolmuş veya daha önce kullanılmış." },
        { status: 409 }
      );
    }

    davetiye = aktivasyonluOlusturma.davetiye;
    aktivasyonKoduKayit = aktivasyonluOlusturma.aktivasyon;
  } else {
    davetiye = await prisma.davetiye.create({
      data: {
        ...davetiyeVerisi,
        odemeDurumu: "odeme_bekliyor",
        aktif: false,
      },
      select: { id: true, slug: true },
    });
  }

  if (aktivasyonKoduKayit) {
    const partnerEmail = aktivasyonKoduKayit.partner.user.email;
    if (partnerEmail) {
      const musteriEmail = session.user.email ?? "";
      davetiyeYayindaBildir({
        partnerEmail,
        firmaAdi: aktivasyonKoduKayit.partner.firmaAdi,
        musteriEmail,
        davetiyeBaslik: veri.baslik,
        davetiyeUrl: `${getSiteUrl()}/davetiye/${davetiye.slug}`,
        panelUrl: `${getSiteUrl()}/partner/panel`,
      });
    }
  }

  if (kullanilanPolaroidler.length > 0) {
    await prisma.geciciYukleme.updateMany({
      where: {
        userId: user.id,
        dosyaUrl: { in: kullanilanPolaroidler },
        kullanildi: false,
      },
      data: {
        kullanildi: true,
        usedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ id: davetiye.id, slug: davetiye.slug, fiyat, activated: !!aktivasyonKoduKayit });
}
