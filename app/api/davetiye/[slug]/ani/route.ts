import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ── GET: onaylanmış anıları listele ── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  const anilar = await prisma.aniDefteri.findMany({
    where: { davetiyeId: davetiye.id, onaylandi: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, yazarAd: true, icerik: true, createdAt: true },
  });

  return NextResponse.json(anilar);
}

/* ── POST: anı yaz (misafir, auth yok) ── */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    select: { id: true, aktif: true },
  });
  if (!davetiye || !davetiye.aktif)
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });

  const body = await req.json();
  const ad = (body.ad as string | undefined)?.trim();
  const icerik = (body.icerik as string | undefined)?.trim();

  if (!ad || ad.length < 2)
    return NextResponse.json({ hata: "Ad en az 2 karakter olmalı." }, { status: 400 });
  if (!icerik || icerik.length < 5)
    return NextResponse.json({ hata: "Mesaj en az 5 karakter olmalı." }, { status: 400 });
  if (icerik.length > 600)
    return NextResponse.json({ hata: "Mesaj en fazla 600 karakter olabilir." }, { status: 400 });

  const ani = await prisma.aniDefteri.create({
    data: {
      davetiyeId: davetiye.id,
      yazarAd: ad,
      icerik,
      onaylandi: false,
    },
  });

  return NextResponse.json({ id: ani.id, mesaj: "Anın alındı, onay bekleniyor." }, { status: 201 });
}
