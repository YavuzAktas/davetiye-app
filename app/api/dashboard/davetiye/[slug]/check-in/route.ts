import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props { params: Promise<{ slug: string }> }

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

export async function GET(_req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: { id: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  const [toplam, girisYapan, bekleyen] = await Promise.all([
    prisma.davetli.count({ where: { davetiyeId: davetiye.id } }),
    prisma.davetli.count({ where: { davetiyeId: davetiye.id, checkinAt: { not: null } } }),
    prisma.davetli.count({ where: { davetiyeId: davetiye.id, checkinAt: null } }),
  ]);

  return NextResponse.json({ toplam, girisYapan, bekleyen });
}

export async function POST(req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const sonuc = checkInSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Geçersiz QR kodu." }, { status: 400 });

  const ozelKod = kodAyikla(sonuc.data.kod);
  const davetli = await prisma.davetli.findFirst({
    where: {
      ozelKod,
      davetiye: { slug, userId: session.user.id },
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

  if (!davetli) return NextResponse.json({ hata: "Bu davetiye için davetli bulunamadı." }, { status: 404 });

  if (davetli.checkinAt) {
    return NextResponse.json({
      durum: "zaten_girdi",
      davetli,
    });
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
      checkinBy: session.user.id,
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
