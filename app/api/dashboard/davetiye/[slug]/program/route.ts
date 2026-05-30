import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeCacheTag } from "@/lib/cache-tags";

interface Props { params: Promise<{ slug: string }> }

const tarihSemasi = z.string().trim().max(40).optional().nullable()
  .transform((value) => value || null)
  .refine((value) => value === null || !Number.isNaN(new Date(value).getTime()));

const opsiyonelMetinSemasi = (max: number) =>
  z.string().trim().max(max).optional().nullable().transform((value) => value || null);

const programSemasi = z.object({
  isim: z.string().trim().min(1).max(120),
  tarih: tarihSemasi,
  saat: opsiyonelMetinSemasi(20),
  mekan: opsiyonelMetinSemasi(200),
  aciklama: opsiyonelMetinSemasi(500),
  ikon: z.string().trim().min(1).max(16).optional().nullable().transform((value) => value || "🎉"),
}).strict();

async function davetiyeDogrula(slug: string, userId: string) {
  return prisma.davetiye.findFirst({
    where: { slug, userId },
    select: { id: true },
  });
}

export async function GET(req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const davetiye = await davetiyeDogrula(slug, session.user.id);
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  const etkinlikler = await prisma.etkinlikProgrami.findMany({
    where: { davetiyeId: davetiye.id },
    orderBy: { sira: "asc" },
    include: { _count: { select: { rsvplar: true } } },
  });

  return NextResponse.json({ etkinlikler });
}

export async function POST(req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const davetiye = await davetiyeDogrula(slug, session.user.id);
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  const sonuc = programSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Geçersiz program bilgisi." }, { status: 400 });
  const { isim, tarih, saat, mekan, aciklama, ikon } = sonuc.data;

  const maxSira = await prisma.etkinlikProgrami.aggregate({
    where: { davetiyeId: davetiye.id },
    _max: { sira: true },
  });

  const etkinlik = await prisma.etkinlikProgrami.create({
    data: {
      davetiyeId: davetiye.id,
      isim,
      tarih:     tarih ? new Date(tarih) : null,
      saat,
      mekan,
      aciklama,
      ikon,
      sira:      (maxSira._max.sira ?? -1) + 1,
    },
    include: { _count: { select: { rsvplar: true } } },
  });

  revalidateTag(davetiyeCacheTag(slug));
  return NextResponse.json({ etkinlik }, { status: 201 });
}
