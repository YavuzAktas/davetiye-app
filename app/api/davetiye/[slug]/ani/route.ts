import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { bildirimOlustur } from "@/lib/bildirim";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import { ipAlNextRequest, ipIzinVer } from "@/lib/rate-limit";
import { davetiyeAniCacheTag } from "@/lib/cache-tags";

const PUBLIC_LISTE_CACHE_SN = 60;

function onayliAnilariGetir(slug: string) {
  return unstable_cache(
    async () => {
      const davetiye = await prisma.davetiye.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!davetiye) return null;

      return prisma.aniDefteri.findMany({
        where: { davetiyeId: davetiye.id, onaylandi: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, yazarAd: true, icerik: true, createdAt: true },
      });
    },
    ["public-anilar", slug],
    { revalidate: PUBLIC_LISTE_CACHE_SN, tags: [davetiyeAniCacheTag(slug)] },
  )();
}

/* ── GET: onaylanmış anıları listele ── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const anilar = await onayliAnilariGetir(slug);
  if (!anilar) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  return NextResponse.json(anilar);
}

/* ── POST: anı yaz (misafir, auth yok) ── */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;
  const ip = ipAlNextRequest(req);
  if (!(await ipIzinVer("ani-defteri", ip, 10, 60_000))) {
    return NextResponse.json({ hata: "Çok fazla istek. Lütfen bir dakika bekleyin." }, { status: 429 });
  }

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    select: { id: true, aktif: true, odemeDurumu: true, aniDefteriAktif: true, userId: true, baslik: true },
  });
  if (!davetiye || !davetiye.aktif)
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  if (!davetiyeOzelligiAktif(davetiye, "aniDefteri"))
    return NextResponse.json({ hata: "Bu davetiyede anı defteri özelliği aktif değil." }, { status: 403 });

  const birSaatOnce = new Date(Date.now() - 3_600_000);
  const sonSaatSayisi = await prisma.aniDefteri.count({
    where: { davetiyeId: davetiye.id, createdAt: { gte: birSaatOnce } },
  });
  if (sonSaatSayisi >= 30)
    return NextResponse.json({ hata: "Saatlik anı gönderim limiti doldu." }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });

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

  bildirimOlustur({
    userId: davetiye.userId,
    tip: "ani",
    baslik: `${ad} anı bıraktı 💌`,
    mesaj: `"${davetiye.baslik}" için yeni bir anı onay bekliyor.`,
    davetiyeSlug: slug,
  });

  return NextResponse.json({ id: ani.id, mesaj: "Anın alındı, onay bekleniyor." }, { status: 201 });
}
