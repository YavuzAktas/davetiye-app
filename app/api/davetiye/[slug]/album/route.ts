import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { bildirimOlustur } from "@/lib/bildirim";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import { dogrulaGorselDosya } from "@/lib/dosya-dogrulama";
import { davetiyeAlbumCacheTag } from "@/lib/cache-tags";
import { ipAlNextRequest, ipIzinVer } from "@/lib/rate-limit";

const PUBLIC_LISTE_CACHE_SN = 60;

function onayliFotolariGetir(slug: string) {
  return unstable_cache(
    async () => {
      const davetiye = await prisma.davetiye.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!davetiye) return null;

      return prisma.albumFoto.findMany({
        where: { davetiyeId: davetiye.id, onaylandi: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, yukleyenAd: true, dosyaUrl: true, createdAt: true },
      });
    },
    ["public-album-fotolari", slug],
    { revalidate: PUBLIC_LISTE_CACHE_SN, tags: [davetiyeAlbumCacheTag(slug)] },
  )();
}

/* ── GET: onaylanmış fotoğrafları listele ── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const fotolar = await onayliFotolariGetir(slug);
  if (!fotolar) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

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
    select: {
      id: true,
      aktif: true,
      odemeDurumu: true,
      albumAktif: true,
      userId: true,
      baslik: true,
    },
  });
  if (!davetiye || !davetiye.aktif)
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  if (!davetiyeOzelligiAktif(davetiye, "album"))
    return NextResponse.json({ hata: "Bu davetiyede albüm özelliği aktif değil." }, { status: 403 });

  const ip = ipAlNextRequest(req);
  if (
    !(await ipIzinVer("album-yukleme-ip", ip, 40, 60 * 60_000)) ||
    !(await ipIzinVer("album-yukleme-davetiye-ip", `${davetiye.id}:${ip}`, 20, 60 * 60_000))
  ) {
    return NextResponse.json({ hata: "Saatlik yükleme limiti doldu." }, { status: 429 });
  }

  /* Rate limit: son 1 saatte aynı davette 100 fotoğraf */
  const birSaatOnce = new Date(Date.now() - 3_600_000);
  const sonSaatSayisi = await prisma.albumFoto.count({
    where: { davetiyeId: davetiye.id, createdAt: { gte: birSaatOnce } },
  });
  if (sonSaatSayisi >= 100)
    return NextResponse.json({ hata: "Saatlik yükleme limiti doldu." }, { status: 429 });

  const form = await req.formData();
  const ad = (form.get("ad") as string | null)?.trim();
  const dosya = form.get("dosya") as File | null;
  const kvkkOnay = form.get("kvkkOnay") === "true";

  if (!ad || ad.length < 2)
    return NextResponse.json({ hata: "Ad en az 2 karakter olmalı." }, { status: 400 });
  if (!kvkkOnay)
    return NextResponse.json({ hata: "Fotoğraf paylaşımı için yayın izni gereklidir." }, { status: 400 });
  if (!dosya)
    return NextResponse.json({ hata: "Dosya gerekli." }, { status: 400 });
  if (dosya.size > 4_000_000)
    return NextResponse.json({ hata: "Dosya max 4 MB olabilir." }, { status: 400 });

  const guvenliDosya = await dogrulaGorselDosya(dosya);
  if (!guvenliDosya)
    return NextResponse.json({ hata: "Sadece JPG, PNG, WEBP veya GIF dosyası kabul edilir." }, { status: 400 });

  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json({ hata: "Depolama yapılandırılmamış." }, { status: 503 });

  let blobUrl: string;
  try {
    const blob = await put(
      `album/${davetiye.id}/${Date.now()}.${guvenliDosya.ext}`,
      guvenliDosya.blob,
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
