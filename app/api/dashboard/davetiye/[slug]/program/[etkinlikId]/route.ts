import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props { params: Promise<{ slug: string; etkinlikId: string }> }

async function etkinlikDogrula(etkinlikId: string, slug: string, userId: string) {
  return prisma.etkinlikProgrami.findFirst({
    where: {
      id: etkinlikId,
      davetiye: { slug, userId },
    },
    select: { id: true, davetiyeId: true, sira: true },
  });
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { slug, etkinlikId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const etkinlik = await etkinlikDogrula(etkinlikId, slug, session.user.id);
  if (!etkinlik) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  const { isim, tarih, saat, mekan, aciklama, ikon, sira } = await req.json();

  const guncellenmis = await prisma.etkinlikProgrami.update({
    where: { id: etkinlikId },
    data: {
      ...(isim      !== undefined && { isim: isim.trim() }),
      ...(tarih     !== undefined && { tarih: tarih ? new Date(tarih) : null }),
      ...(saat      !== undefined && { saat: saat?.trim() || null }),
      ...(mekan     !== undefined && { mekan: mekan?.trim() || null }),
      ...(aciklama  !== undefined && { aciklama: aciklama?.trim() || null }),
      ...(ikon      !== undefined && { ikon }),
      ...(sira      !== undefined && { sira }),
    },
    include: { _count: { select: { rsvplar: true } } },
  });

  return NextResponse.json({ etkinlik: guncellenmis });
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { slug, etkinlikId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const etkinlik = await etkinlikDogrula(etkinlikId, slug, session.user.id);
  if (!etkinlik) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  await prisma.etkinlikProgrami.delete({ where: { id: etkinlikId } });

  /* Kalan etkinlikleri sıfırdan sırala */
  const kalanlar = await prisma.etkinlikProgrami.findMany({
    where: { davetiyeId: etkinlik.davetiyeId },
    orderBy: { sira: "asc" },
    select: { id: true },
  });
  await Promise.all(
    kalanlar.map((e, i) =>
      prisma.etkinlikProgrami.update({ where: { id: e.id }, data: { sira: i } })
    )
  );

  return NextResponse.json({ basarili: true });
}
