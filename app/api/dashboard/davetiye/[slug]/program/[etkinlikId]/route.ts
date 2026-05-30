import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeCacheTag } from "@/lib/cache-tags";

interface Props { params: Promise<{ slug: string; etkinlikId: string }> }

const bosVeyaTarihMi = (value: string | null | undefined) =>
  value === undefined || value === null || value.trim() === "" || !Number.isNaN(new Date(value).getTime());

const programGuncelleSemasi = z.object({
  isim: z.string().trim().min(1).max(120).optional(),
  tarih: z.union([z.string().trim().max(40), z.null()]).optional().refine(bosVeyaTarihMi),
  saat: z.union([z.string().trim().max(20), z.null()]).optional(),
  mekan: z.union([z.string().trim().max(200), z.null()]).optional(),
  aciklama: z.union([z.string().trim().max(500), z.null()]).optional(),
  ikon: z.union([z.string().trim().min(1).max(16), z.null()]).optional(),
  sira: z.coerce.number().int().min(0).max(200).optional(),
}).strict().refine((data) => Object.keys(data).length > 0);

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

  const sonuc = programGuncelleSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Geçersiz program bilgisi." }, { status: 400 });
  const { isim, tarih, saat, mekan, aciklama, ikon, sira } = sonuc.data;

  const guncellenmis = await prisma.etkinlikProgrami.update({
    where: { id: etkinlikId },
    data: {
      ...(isim      !== undefined && { isim }),
      ...(tarih     !== undefined && { tarih: tarih ? new Date(tarih) : null }),
      ...(saat      !== undefined && { saat: saat || null }),
      ...(mekan     !== undefined && { mekan: mekan || null }),
      ...(aciklama  !== undefined && { aciklama: aciklama || null }),
      ...(ikon      !== undefined && { ikon: ikon || "🎉" }),
      ...(sira      !== undefined && { sira }),
    },
    include: { _count: { select: { rsvplar: true } } },
  });

  revalidateTag(davetiyeCacheTag(slug));
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

  revalidateTag(davetiyeCacheTag(slug));
  return NextResponse.json({ basarili: true });
}
