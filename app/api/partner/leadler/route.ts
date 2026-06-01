import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ipIzinVer } from "@/lib/rate-limit";

const DURUMLAR = ["yeni", "gorusuldu", "teklif_gonderildi", "kapora_bekliyor", "kazandi", "kaybedildi"] as const;

const leadSemasi = z.object({
  baslik: z.string().trim().min(2).max(120),
  ilgiliKisi: z.string().trim().max(120).optional().nullable(),
  telefon: z.string().trim().max(30).optional().nullable(),
  eposta: z.string().trim().email().max(160).optional().nullable().or(z.literal("")),
  etkinlikTuru: z.string().trim().max(60).optional().nullable(),
  etkinlikTarihi: z.string().trim().optional().nullable(),
  kisiSayisi: z.coerce.number().int().min(1).max(10000).optional().nullable(),
  kaynak: z.string().trim().max(60).optional().nullable(),
  durum: z.enum(DURUMLAR).default("yeni"),
  not: z.string().trim().max(500).optional().nullable(),
}).strict();

const leadGuncelleSemasi = leadSemasi.partial().extend({
  id: z.string().min(1),
  durum: z.enum(DURUMLAR).optional(),
}).strict();

const leadSilSemasi = z.object({
  id: z.string().min(1),
}).strict();

function bosIseNull(deger?: string | null) {
  const temiz = deger?.trim();
  return temiz ? temiz : null;
}

function tarihHazirla(deger?: string | null) {
  const temiz = bosIseNull(deger);
  if (!temiz) return null;
  const tarih = new Date(`${temiz}T12:00:00.000Z`);
  return Number.isNaN(tarih.getTime()) ? null : tarih;
}

async function aktifPartnerBul(userId: string) {
  const simdi = new Date();
  const partner = await prisma.partner.findUnique({
    where: { userId },
    select: { id: true, durum: true },
  });

  if (!partner || partner.durum !== "aktif") return null;

  const abonelik = await prisma.partnerAbonelik.findFirst({
    where: {
      partnerId: partner.id,
      aktif: true,
      OR: [{ bitisAt: null }, { bitisAt: { gt: simdi } }],
    },
    select: { id: true },
  });

  return abonelik ? partner : null;
}

function leadSecimi() {
  return {
    id: true,
    baslik: true,
    ilgiliKisi: true,
    telefon: true,
    eposta: true,
    etkinlikTuru: true,
    etkinlikTarihi: true,
    kisiSayisi: true,
    kaynak: true,
    durum: true,
    not: true,
    sonGorusmeAt: true,
    createdAt: true,
    updatedAt: true,
  } as const;
}

function leadJson(lead: {
  id: string;
  baslik: string;
  ilgiliKisi: string | null;
  telefon: string | null;
  eposta: string | null;
  etkinlikTuru: string | null;
  etkinlikTarihi: Date | null;
  kisiSayisi: number | null;
  kaynak: string | null;
  durum: string;
  not: string | null;
  sonGorusmeAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...lead,
    etkinlikTarihi: lead.etkinlikTarihi?.toISOString() ?? null,
    sonGorusmeAt: lead.sonGorusmeAt?.toISOString() ?? null,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  if (!(await ipIzinVer("partner-lead", session.user.id, 60, 60 * 60_000))) {
    return NextResponse.json({ hata: "Saatlik lead işlem limitine ulaştınız." }, { status: 429 });
  }

  const sonuc = leadSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Lead bilgileri geçersiz." }, { status: 400 });

  const partner = await aktifPartnerBul(session.user.id);
  if (!partner) return NextResponse.json({ hata: "Aktif partner aboneliği gerekli." }, { status: 403 });

  const toplam = await prisma.partnerLead.count({ where: { partnerId: partner.id } });
  if (toplam >= 250) {
    return NextResponse.json({ hata: "En fazla 250 lead saklanabilir. Eski kayıtları arşivleyin veya silin." }, { status: 409 });
  }

  const lead = await prisma.partnerLead.create({
    data: {
      partnerId: partner.id,
      baslik: sonuc.data.baslik,
      ilgiliKisi: bosIseNull(sonuc.data.ilgiliKisi),
      telefon: bosIseNull(sonuc.data.telefon),
      eposta: bosIseNull(sonuc.data.eposta),
      etkinlikTuru: bosIseNull(sonuc.data.etkinlikTuru),
      etkinlikTarihi: tarihHazirla(sonuc.data.etkinlikTarihi),
      kisiSayisi: sonuc.data.kisiSayisi ?? null,
      kaynak: bosIseNull(sonuc.data.kaynak),
      durum: sonuc.data.durum,
      not: bosIseNull(sonuc.data.not),
      sonGorusmeAt: new Date(),
    },
    select: leadSecimi(),
  });

  return NextResponse.json({ lead: leadJson(lead) });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  if (!(await ipIzinVer("partner-lead", session.user.id, 90, 60 * 60_000))) {
    return NextResponse.json({ hata: "Saatlik lead işlem limitine ulaştınız." }, { status: 429 });
  }

  const sonuc = leadGuncelleSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Lead bilgileri geçersiz." }, { status: 400 });

  const partner = await aktifPartnerBul(session.user.id);
  if (!partner) return NextResponse.json({ hata: "Aktif partner aboneliği gerekli." }, { status: 403 });

  const guncelleme = await prisma.partnerLead.updateMany({
    where: { id: sonuc.data.id, partnerId: partner.id },
    data: {
      ...(sonuc.data.baslik !== undefined && { baslik: sonuc.data.baslik }),
      ...(sonuc.data.ilgiliKisi !== undefined && { ilgiliKisi: bosIseNull(sonuc.data.ilgiliKisi) }),
      ...(sonuc.data.telefon !== undefined && { telefon: bosIseNull(sonuc.data.telefon) }),
      ...(sonuc.data.eposta !== undefined && { eposta: bosIseNull(sonuc.data.eposta) }),
      ...(sonuc.data.etkinlikTuru !== undefined && { etkinlikTuru: bosIseNull(sonuc.data.etkinlikTuru) }),
      ...(sonuc.data.etkinlikTarihi !== undefined && { etkinlikTarihi: tarihHazirla(sonuc.data.etkinlikTarihi) }),
      ...(sonuc.data.kisiSayisi !== undefined && { kisiSayisi: sonuc.data.kisiSayisi ?? null }),
      ...(sonuc.data.kaynak !== undefined && { kaynak: bosIseNull(sonuc.data.kaynak) }),
      ...(sonuc.data.durum !== undefined && { durum: sonuc.data.durum, sonGorusmeAt: new Date() }),
      ...(sonuc.data.not !== undefined && { not: bosIseNull(sonuc.data.not) }),
    },
  });

  if (guncelleme.count !== 1) return NextResponse.json({ hata: "Lead bulunamadı." }, { status: 404 });

  const lead = await prisma.partnerLead.findFirstOrThrow({
    where: { id: sonuc.data.id, partnerId: partner.id },
    select: leadSecimi(),
  });

  return NextResponse.json({ lead: leadJson(lead) });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  if (!(await ipIzinVer("partner-lead", session.user.id, 30, 60 * 60_000))) {
    return NextResponse.json({ hata: "Saatlik lead işlem limitine ulaştınız." }, { status: 429 });
  }

  const sonuc = leadSilSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Lead silme isteği geçersiz." }, { status: 400 });

  const partner = await aktifPartnerBul(session.user.id);
  if (!partner) return NextResponse.json({ hata: "Aktif partner aboneliği gerekli." }, { status: 403 });

  const silme = await prisma.partnerLead.deleteMany({ where: { id: sonuc.data.id, partnerId: partner.id } });
  if (silme.count !== 1) return NextResponse.json({ hata: "Lead bulunamadı." }, { status: 404 });

  return NextResponse.json({ tamam: true });
}
