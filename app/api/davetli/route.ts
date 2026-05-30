import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { imhaKaydiOlustur } from "@/lib/imha-kaydi";
import { yasalOnayKaydiOlustur } from "@/lib/yasal-onay-kaydi";

async function sahiplikDogrula(davetiyeId: string, userId: string) {
  const davetiye = await prisma.davetiye.findUnique({
    where: { id: davetiyeId },
    select: { userId: true },
  });
  return davetiye?.userId === userId;
}

function kisiLimitiNormalize(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  const sayi = Number(value);
  if (!Number.isInteger(sayi)) return null;
  return Math.max(1, Math.min(20, sayi));
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const davetiyeId = new URL(req.url).searchParams.get("davetiyeId");
  if (!davetiyeId) {
    return NextResponse.json({ hata: "davetiyeId gerekli." }, { status: 400 });
  }

  const davetliler = await prisma.davetli.findMany({
    where: { davetiyeId, davetiye: { userId: session.user.id } },
    select: {
      id: true,
      ad: true,
      telefon: true,
      email: true,
      grup: true,
      notlar: true,
      kisiLimiti: true,
      ozelKod: true,
      linkGoruntulendiAt: true,
      linkGoruntulenmeSayisi: true,
      whatsappGonderildiAt: true,
      sonHatirlatmaAt: true,
      hatirlatmaSayisi: true,
      rsvpId: true,
    },
    orderBy: [{ grup: "asc" }, { ad: "asc" }],
    take: 500,
  });

  return NextResponse.json({ davetliler });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const { davetiyeId, davetliler, kvkkSorumlulukOnayi } = await req.json();

  if (!davetiyeId || !Array.isArray(davetliler) || davetliler.length === 0) {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }
  if (kvkkSorumlulukOnayi !== true) {
    return NextResponse.json({ hata: "Misafir verileri için KVKK sorumluluk onayı gereklidir." }, { status: 400 });
  }

  if (!await sahiplikDogrula(davetiyeId, session.user.id)) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  type DavetliGirdisi = { ad: string; telefon?: string; email?: string; grup?: string; notlar?: string; kisiLimiti?: number };
  const yeniDavetliler = await prisma.davetli.createMany({
    data: davetliler.map((d: DavetliGirdisi) => ({
      davetiyeId,
      ad:         d.ad,
      telefon:    d.telefon    || null,
      email:      d.email      || null,
      grup:       d.grup       || "diger",
      notlar:     d.notlar     || null,
      kisiLimiti: kisiLimitiNormalize(d.kisiLimiti),
      ozelKod:    nanoid(10),
    })),
  });

  await yasalOnayKaydiOlustur({
    userId: session.user.id,
    email: session.user.email,
    onayTipi: "davetli-listesi-ucuncu-kisi-verisi-sorumluluk",
    kaynak: "davetli-listesi",
  });

  return NextResponse.json({ basarili: true, count: yeniDavetliler.count });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const { id, grup, notlar, kisiLimiti, whatsappAksiyon } = await req.json();
  if (!id) return NextResponse.json({ hata: "id gerekli." }, { status: 400 });

  const davetli = await prisma.davetli.findUnique({
    where: { id },
    select: {
      whatsappGonderildiAt: true,
      davetiye: { select: { userId: true } },
    },
  });

  if (!davetli || davetli.davetiye.userId !== session.user.id) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  const simdi = new Date();
  const guncellenmis = await prisma.davetli.update({
    where: { id },
    data: {
      ...(grup    !== undefined && { grup }),
      ...(notlar  !== undefined && { notlar: notlar || null }),
      ...(kisiLimiti !== undefined && {
        kisiLimiti: kisiLimitiNormalize(kisiLimiti),
      }),
      ...(whatsappAksiyon === "davet" && { whatsappGonderildiAt: davetli.whatsappGonderildiAt ?? simdi }),
      ...(whatsappAksiyon === "hatirlatma" && {
        sonHatirlatmaAt: simdi,
        hatirlatmaSayisi: { increment: 1 },
        whatsappGonderildiAt: davetli.whatsappGonderildiAt ?? simdi,
      }),
    },
    select: {
      id: true,
      ad: true,
      telefon: true,
      email: true,
      grup: true,
      notlar: true,
      kisiLimiti: true,
      ozelKod: true,
      linkGoruntulendiAt: true,
      linkGoruntulenmeSayisi: true,
      whatsappGonderildiAt: true,
      sonHatirlatmaAt: true,
      hatirlatmaSayisi: true,
      rsvpId: true,
    },
  });

  return NextResponse.json({ basarili: true, davetli: guncellenmis });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ hata: "id gerekli." }, { status: 400 });

  const davetli = await prisma.davetli.findUnique({
    where: { id },
    select: { davetiye: { select: { userId: true } } },
  });

  if (!davetli || davetli.davetiye.userId !== session.user.id) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  await prisma.davetli.delete({ where: { id } });
  await imhaKaydiOlustur({
    kaynak: "tekil-davetli-silme",
    islemTuru: "kullanici-paneli-silme",
    veriKategorisi: "Davetli listesi kaydı",
    adet: 1,
    yontem: "veritabanı kayıt silme",
    gerekce: "Davetiye sahibinin panel üzerinden silme talebi",
  });

  return NextResponse.json({ basarili: true });
}
