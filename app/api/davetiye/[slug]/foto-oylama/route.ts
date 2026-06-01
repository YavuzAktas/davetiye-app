import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import { ipAlNextRequest, ipIzinVer } from "@/lib/rate-limit";
import { z } from "zod";

const oylamaSemasi = z.object({
  kazananId: z.string().min(1).max(50),
  oturumId:  z.string().uuid(),
}).strict();

async function davetiyeAlbumBul(slug: string) {
  return prisma.davetiye.findUnique({
    where: { slug },
    select: { id: true, aktif: true, odemeDurumu: true, albumAktif: true },
  });
}

/* GET — onaylı fotoğrafları oylama sayısıyla birlikte döndür */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const davetiye = await davetiyeAlbumBul(slug);
  if (!davetiye || !davetiye.aktif) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });
  if (!davetiyeOzelligiAktif(davetiye, "album")) return NextResponse.json({ hata: "Albüm aktif değil." }, { status: 403 });

  const fotolar = await prisma.albumFoto.findMany({
    where: { davetiyeId: davetiye.id, onaylandi: true },
    orderBy: { oylamaSayisi: "desc" },
    select: { id: true, yukleyenAd: true, dosyaUrl: true, oylamaSayisi: true },
  });

  return NextResponse.json(fotolar);
}

/* POST — oy kaydet */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const ip = ipAlNextRequest(req);
  if (
    !(await ipIzinVer("foto-oylama-ip",  ip,    120, 60 * 60_000)) ||
    !(await ipIzinVer("foto-oylama-min", ip,     30,      60_000))
  ) {
    return NextResponse.json({ hata: "Çok fazla oy. Biraz bekleyin." }, { status: 429 });
  }

  const sonuc = oylamaSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });

  const davetiye = await davetiyeAlbumBul(slug);
  if (!davetiye || !davetiye.aktif) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });
  if (!davetiyeOzelligiAktif(davetiye, "album")) return NextResponse.json({ hata: "Albüm aktif değil." }, { status: 403 });

  // Fotoğrafın bu davete ait ve onaylı olduğunu doğrula
  const foto = await prisma.albumFoto.findFirst({
    where: { id: sonuc.data.kazananId, davetiyeId: davetiye.id, onaylandi: true },
    select: { id: true },
  });
  if (!foto) return NextResponse.json({ hata: "Fotoğraf bulunamadı." }, { status: 404 });

  // Oturum başına max 200 oy (tüm zaman)
  const oturumOySayisi = await prisma.albumFotoOylama.count({
    where: { oturumId: sonuc.data.oturumId, davetiyeId: davetiye.id },
  });
  if (oturumOySayisi >= 200) {
    return NextResponse.json({ hata: "Oturum oy limitine ulaşıldı." }, { status: 429 });
  }

  // Atomic increment + yeni oy kaydı
  await prisma.$transaction([
    prisma.albumFoto.update({
      where: { id: foto.id },
      data: { oylamaSayisi: { increment: 1 } },
    }),
    prisma.albumFotoOylama.create({
      data: { fotoId: foto.id, davetiyeId: davetiye.id, oturumId: sonuc.data.oturumId },
    }),
  ]);

  return NextResponse.json({ tamam: true });
}
