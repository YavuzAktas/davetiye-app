import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import {
  PERSONEL_ROLLERI,
  personelRolGecerliMi,
  personelRolEtiketi,
  personelTokenHash,
  personelTokenOlustur,
} from "@/lib/personel-erisim";

interface Props {
  params: Promise<{ slug: string }>;
}

const olusturSemasi = z.object({
  rol: z.string().trim().default(PERSONEL_ROLLERI.checkIn),
  etiket: z.string().trim().max(80).optional().nullable(),
  gun: z.coerce.number().int().min(1).max(14).default(2),
}).strict();

function erisimLinki(req: NextRequest, token: string) {
  const base = process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;
  return `${base}/personel/${token}/check-in`;
}

async function davetiyeBul(slug: string, userId: string) {
  return prisma.davetiye.findFirst({
    where: { slug, userId },
    select: { id: true, slug: true, baslik: true, checkInAktif: true, odemeDurumu: true },
  });
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const davetiye = await davetiyeBul(slug, session.user.id);
  if (!davetiye) {
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  }

  const erisimler = await prisma.davetiyePersonelErisim.findMany({
    where: { davetiyeId: davetiye.id },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      rol: true,
      etiket: true,
      aktif: true,
      expiresAt: true,
      lastUsedAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    erisimler: erisimler.map(e => ({
      ...e,
      rolEtiketi: personelRolEtiketi(e.rol),
      expiresAt: e.expiresAt?.toISOString() ?? null,
      lastUsedAt: e.lastUsedAt?.toISOString() ?? null,
      revokedAt: e.revokedAt?.toISOString() ?? null,
      createdAt: e.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const sonuc = olusturSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success || !personelRolGecerliMi(sonuc.data.rol)) {
    return NextResponse.json({ hata: "Geçersiz personel erişimi." }, { status: 400 });
  }

  const davetiye = await davetiyeBul(slug, session.user.id);
  if (!davetiye) {
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  }
  if (sonuc.data.rol === PERSONEL_ROLLERI.checkIn && !davetiyeOzelligiAktif(davetiye, "checkIn")) {
    return NextResponse.json({ hata: "QR Check-in aktif olmayan davetiyede personel linki oluşturulamaz." }, { status: 409 });
  }

  const aktifSayisi = await prisma.davetiyePersonelErisim.count({
    where: {
      davetiyeId: davetiye.id,
      aktif: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });
  if (aktifSayisi >= 10) {
    return NextResponse.json({ hata: "Bu davetiye için en fazla 10 aktif personel linki olabilir." }, { status: 409 });
  }

  const token = personelTokenOlustur();
  const expiresAt = new Date(Date.now() + sonuc.data.gun * 24 * 60 * 60 * 1000);
  const erisim = await prisma.davetiyePersonelErisim.create({
    data: {
      davetiyeId: davetiye.id,
      rol: sonuc.data.rol,
      etiket: sonuc.data.etiket || null,
      tokenHash: personelTokenHash(token),
      expiresAt,
    },
    select: {
      id: true,
      rol: true,
      etiket: true,
      aktif: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    erisim: {
      ...erisim,
      rolEtiketi: personelRolEtiketi(erisim.rol),
      expiresAt: erisim.expiresAt?.toISOString() ?? null,
      createdAt: erisim.createdAt.toISOString(),
    },
    link: erisimLinki(req, token),
  }, { status: 201 });
}
