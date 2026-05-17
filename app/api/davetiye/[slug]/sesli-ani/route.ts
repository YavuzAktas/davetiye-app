import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { bildirimOlustur } from "@/lib/bildirim";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import { dogrulaSesDosya } from "@/lib/dosya-dogrulama";
import { davetiyeSesliAniCacheTag } from "@/lib/cache-tags";

const PUBLIC_LISTE_CACHE_SN = 60;

function onayliSesliAnilariGetir(slug: string) {
  return unstable_cache(
    async () => {
      const davetiye = await prisma.davetiye.findUnique({
        where: { slug },
        select: { id: true, sesliAniAktif: true },
      });
      if (!davetiye) return null;

      return prisma.sesliAni.findMany({
        where: { davetiyeId: davetiye.id, onaylandi: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, adSoyad: true, dosyaUrl: true, sure: true, createdAt: true },
      });
    },
    ["public-sesli-anilar", slug],
    { revalidate: PUBLIC_LISTE_CACHE_SN, tags: [davetiyeSesliAniCacheTag(slug)] },
  )();
}

/* ── GET: onaylanmış sesli anıları listele ── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const anilar = await onayliSesliAnilariGetir(slug);
  if (!anilar) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  return NextResponse.json(anilar);
}

/* ── POST: sesli anı kaydet (misafir, auth yok) ── */
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
      userId: true,
      baslik: true,
      sesliAniAktif: true,
      user: { select: { plan: true } },
    },
  });
  if (!davetiye || !davetiye.aktif)
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  if (!davetiyeOzelligiAktif(davetiye, "sesliAni"))
    return NextResponse.json({ hata: "Bu davetiyede sesli anı özelliği aktif değil." }, { status: 403 });

  /* Rate limit: son 1 saatte aynı davette 5 sesli anı */
  const birSaatOnce = new Date(Date.now() - 3_600_000);
  const sonSaatSayisi = await prisma.sesliAni.count({
    where: { davetiyeId: davetiye.id, createdAt: { gte: birSaatOnce } },
  });
  if (sonSaatSayisi >= 5)
    return NextResponse.json({ hata: "Saatlik yükleme limiti doldu." }, { status: 429 });

  const form = await req.formData();
  const adSoyad = (form.get("adSoyad") as string | null)?.trim();
  const dosya = form.get("dosya") as File | null;
  const sureStr = form.get("sure") as string | null;
  const sure = sureStr ? parseInt(sureStr, 10) : 0;

  if (!adSoyad || adSoyad.length < 2)
    return NextResponse.json({ hata: "Ad Soyad en az 2 karakter olmalı." }, { status: 400 });
  if (!dosya)
    return NextResponse.json({ hata: "Ses dosyası gerekli." }, { status: 400 });
  if (dosya.size > 4_000_000)
    return NextResponse.json({ hata: "Dosya max 4 MB olabilir." }, { status: 400 });
  if (sure > 30 || sure < 1)
    return NextResponse.json({ hata: "Ses kaydı 1–30 saniye arasında olmalı." }, { status: 400 });

  const guvenliDosya = await dogrulaSesDosya(dosya);
  if (!guvenliDosya)
    return NextResponse.json({ hata: "Sadece WEBM, OGG, MP3, M4A veya WAV ses dosyası kabul edilir." }, { status: 400 });

  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json({ hata: "Depolama yapılandırılmamış." }, { status: 503 });

  let blobUrl: string;
  try {
    const blob = await put(
      `sesli-ani/${davetiye.id}/${Date.now()}.${guvenliDosya.ext}`,
      guvenliDosya.blob,
      { access: "public" }
    );
    blobUrl = blob.url;
  } catch (err) {
    console.error("Blob upload hatası:", err);
    return NextResponse.json({ hata: "Dosya yüklenemedi, lütfen tekrar dene." }, { status: 500 });
  }

  const ani = await prisma.sesliAni.create({
    data: {
      davetiyeId: davetiye.id,
      adSoyad,
      dosyaUrl: blobUrl,
      sure,
      onaylandi: false,
    },
  });

  bildirimOlustur({
    userId: davetiye.userId,
    tip: "sesli-ani",
    baslik: `${adSoyad} sesli anı bıraktı 🎙️`,
    mesaj: `"${davetiye.baslik}" için yeni bir sesli anı onay bekliyor.`,
    davetiyeSlug: slug,
  });

  return NextResponse.json({ id: ani.id, mesaj: "Sesli anın alındı, onay bekleniyor." }, { status: 201 });
}
