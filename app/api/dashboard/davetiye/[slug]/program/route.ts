import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeCacheTag } from "@/lib/cache-tags";

interface Props { params: Promise<{ slug: string }> }

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

  const { isim, tarih, saat, mekan, aciklama, ikon } = await req.json();
  if (!isim?.trim()) return NextResponse.json({ hata: "Etkinlik adı gerekli." }, { status: 400 });

  const maxSira = await prisma.etkinlikProgrami.aggregate({
    where: { davetiyeId: davetiye.id },
    _max: { sira: true },
  });

  const etkinlik = await prisma.etkinlikProgrami.create({
    data: {
      davetiyeId: davetiye.id,
      isim:      isim.trim(),
      tarih:     tarih ? new Date(tarih) : null,
      saat:      saat?.trim()     || null,
      mekan:     mekan?.trim()    || null,
      aciklama:  aciklama?.trim() || null,
      ikon:      ikon             || "🎉",
      sira:      (maxSira._max.sira ?? -1) + 1,
    },
    include: { _count: { select: { rsvplar: true } } },
  });

  revalidateTag(davetiyeCacheTag(slug));
  return NextResponse.json({ etkinlik }, { status: 201 });
}
