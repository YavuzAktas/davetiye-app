import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { bildirimOlustur } from "@/lib/bildirim";
import { planOzellikVar } from "@/lib/planlar";

/* ── GET: onaylanmış fotoğrafları listele ── */
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

  const fotolar = await prisma.albumFoto.findMany({
    where: { davetiyeId: davetiye.id, onaylandi: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, yukleyenAd: true, dosyaUrl: true, createdAt: true },
  });

  return NextResponse.json(fotolar);
}

/* ── POST: fotoğraf yükle (misafir, auth yok) ── */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    select: { id: true, aktif: true, userId: true, baslik: true, user: { select: { plan: true } } },
  });
  if (!davetiye || !davetiye.aktif)
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  if (!planOzellikVar(davetiye.user.plan, "album"))
    return NextResponse.json({ hata: "Bu davetiyede albüm özelliği aktif değil." }, { status: 403 });

  /* Rate limit: son 1 saatte aynı davette 10 fotoğraf yeterli */
  const birSaatOnce = new Date(Date.now() - 3_600_000);
  const sonSaatSayisi = await prisma.albumFoto.count({
    where: { davetiyeId: davetiye.id, createdAt: { gte: birSaatOnce } },
  });
  if (sonSaatSayisi >= 10)
    return NextResponse.json({ hata: "Saatlik yükleme limiti doldu." }, { status: 429 });

  const form = await req.formData();
  const ad = (form.get("ad") as string | null)?.trim();
  const dosya = form.get("dosya") as File | null;

  if (!ad || ad.length < 2)
    return NextResponse.json({ hata: "Ad en az 2 karakter olmalı." }, { status: 400 });
  if (!dosya)
    return NextResponse.json({ hata: "Dosya gerekli." }, { status: 400 });
  if (dosya.size > 6_000_000)
    return NextResponse.json({ hata: "Dosya max 6 MB olabilir." }, { status: 400 });
  if (!dosya.type.startsWith("image/"))
    return NextResponse.json({ hata: "Sadece resim dosyası kabul edilir." }, { status: 400 });

  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json({ hata: "Depolama yapılandırılmamış." }, { status: 503 });

  let blobUrl: string;
  try {
    const blob = await put(
      `album/${davetiye.id}/${Date.now()}-${dosya.name.replace(/[^a-z0-9.]/gi, "_")}`,
      dosya,
      { access: "public" }
    );
    blobUrl = blob.url;
  } catch (err) {
    console.error("Blob upload hatası:", err);
    return NextResponse.json({ hata: "Dosya yüklenemedi, lütfen tekrar dene." }, { status: 500 });
  }

  const foto = await prisma.albumFoto.create({
    data: {
      davetiyeId: davetiye.id,
      yukleyenAd: ad,
      dosyaUrl: blobUrl,
      onaylandi: false,
    },
  });

  bildirimOlustur({
    userId: davetiye.userId,
    tip: "album",
    baslik: `${ad} fotoğraf yükledi 📸`,
    mesaj: `"${davetiye.baslik}" için yeni bir fotoğraf onay bekliyor.`,
    davetiyeSlug: slug,
  });

  return NextResponse.json({ id: foto.id, mesaj: "Fotoğraf yüklendi, onay bekleniyor." }, { status: 201 });
}
