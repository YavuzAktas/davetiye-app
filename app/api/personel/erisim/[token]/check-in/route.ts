import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ipAlNextRequest, ipIzinVer } from "@/lib/rate-limit";
import { PERSONEL_ROLLERI, personelTokenHash } from "@/lib/personel-erisim";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";

interface Props {
  params: Promise<{ token: string }>;
}

const checkInSemasi = z.object({
  kod: z.string().trim().min(1).max(300),
  kisiSayisi: z.coerce.number().int().min(1).max(20).optional(),
}).strict();

function kodAyikla(raw: string) {
  const temiz = raw.trim();
  try {
    const url = new URL(temiz);
    const parcalar = url.pathname.split("/").filter(Boolean);
    if (parcalar[0] === "d" && parcalar[1]) return parcalar[1];
  } catch {}
  return temiz.replace(/^\/?d\//, "").split(/[?#]/)[0];
}

async function erisimBul(token: string) {
  const simdi = new Date();
  return prisma.davetiyePersonelErisim.findFirst({
    where: {
      tokenHash: personelTokenHash(token),
      aktif: true,
      rol: PERSONEL_ROLLERI.checkIn,
      OR: [{ expiresAt: null }, { expiresAt: { gt: simdi } }],
    },
    select: {
      id: true,
      davetiyeId: true,
      etiket: true,
      davetiye: {
        select: {
          id: true,
          slug: true,
          baslik: true,
          odemeDurumu: true,
          checkInAktif: true,
          _count: { select: { davetliler: true } },
        },
      },
    },
  });
}

export async function GET(req: NextRequest, { params }: Props) {
  const { token } = await params;
  const ip = ipAlNextRequest(req);
  const tokenAnahtari = personelTokenHash(token);
  if (!(await ipIzinVer("personel-checkin-get", `${tokenAnahtari}:${ip}`, 60, 60_000))) {
    return NextResponse.json({ hata: "Çok fazla istek." }, { status: 429 });
  }

  const erisim = await erisimBul(token);
  if (!erisim || !davetiyeOzelligiAktif(erisim.davetiye, "checkIn")) {
    return NextResponse.json({ hata: "Personel erişimi geçersiz veya süresi dolmuş." }, { status: 404 });
  }

  const girisYapan = await prisma.davetli.count({
    where: { davetiyeId: erisim.davetiyeId, checkinAt: { not: null } },
  });

  return NextResponse.json({
    baslik: erisim.davetiye.baslik,
    slug: erisim.davetiye.slug,
    etiket: erisim.etiket,
    toplam: erisim.davetiye._count.davetliler,
    girisYapan,
  });
}

export async function POST(req: NextRequest, { params }: Props) {
  const { token } = await params;
  const ip = ipAlNextRequest(req);
  const tokenAnahtari = personelTokenHash(token);
  if (!(await ipIzinVer("personel-checkin-post", `${tokenAnahtari}:${ip}`, 120, 60_000))) {
    return NextResponse.json({ hata: "Çok fazla istek." }, { status: 429 });
  }

  const sonuc = checkInSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) {
    return NextResponse.json({ hata: "Geçersiz QR kodu." }, { status: 400 });
  }

  const erisim = await erisimBul(token);
  if (!erisim || !davetiyeOzelligiAktif(erisim.davetiye, "checkIn")) {
    return NextResponse.json({ hata: "Personel erişimi geçersiz veya süresi dolmuş." }, { status: 404 });
  }

  const ozelKod = kodAyikla(sonuc.data.kod);
  const davetli = await prisma.davetli.findFirst({
    where: {
      ozelKod,
      davetiyeId: erisim.davetiyeId,
    },
    select: {
      id: true,
      ad: true,
      grup: true,
      kisiLimiti: true,
      checkinAt: true,
      checkinKisiSayisi: true,
      rsvp: { select: { katilim: true, kisiSayisi: true } },
    },
  });

  if (!davetli) {
    return NextResponse.json({ hata: "Bu davetiye için davetli bulunamadı." }, { status: 404 });
  }

  await prisma.davetiyePersonelErisim.update({
    where: { id: erisim.id },
    data: { lastUsedAt: new Date() },
  });

  if (davetli.checkinAt) {
    return NextResponse.json({ durum: "zaten_girdi", davetli });
  }

  const kisiSayisi = sonuc.data.kisiSayisi
    ?? davetli.rsvp?.kisiSayisi
    ?? davetli.kisiLimiti
    ?? 1;

  const guncellenmis = await prisma.davetli.update({
    where: { id: davetli.id },
    data: {
      checkinAt: new Date(),
      checkinKisiSayisi: Math.max(1, Math.min(20, kisiSayisi)),
      checkinBy: `personel:${erisim.id}`,
    },
    select: {
      id: true,
      ad: true,
      grup: true,
      kisiLimiti: true,
      checkinAt: true,
      checkinKisiSayisi: true,
      rsvp: { select: { katilim: true, kisiSayisi: true } },
    },
  });

  return NextResponse.json({ durum: "giris_yapildi", davetli: guncellenmis });
}
