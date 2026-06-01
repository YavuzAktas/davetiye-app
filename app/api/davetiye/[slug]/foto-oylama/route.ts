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

/* GET — onaylı fotoğrafları oylama sayısıyla döndür */
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

/* POST — turnuva şampiyonunu kaydet (oturum başına 1 oy, değiştirilebilir) */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const ip = ipAlNextRequest(req);
  if (!(await ipIzinVer("foto-oylama-ip", ip, 60, 60 * 60_000))) {
    return NextResponse.json({ hata: "Çok fazla istek. Biraz bekleyin." }, { status: 429 });
  }

  const sonuc = oylamaSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });

  const davetiye = await davetiyeAlbumBul(slug);
  if (!davetiye || !davetiye.aktif) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });
  if (!davetiyeOzelligiAktif(davetiye, "album")) return NextResponse.json({ hata: "Albüm aktif değil." }, { status: 403 });

  const foto = await prisma.albumFoto.findFirst({
    where: { id: sonuc.data.kazananId, davetiyeId: davetiye.id, onaylandi: true },
    select: { id: true },
  });
  if (!foto) return NextResponse.json({ hata: "Fotoğraf bulunamadı." }, { status: 404 });

  // Mevcut oyu bul (bu oturum daha önce oy verdiyse)
  const mevcutOy = await prisma.albumFotoOylama.findUnique({
    where: { davetiyeId_oturumId: { davetiyeId: davetiye.id, oturumId: sonuc.data.oturumId } },
    select: { fotoId: true },
  });

  if (mevcutOy) {
    if (mevcutOy.fotoId === foto.id) {
      // Aynı fotoğrafa tekrar oy — işlem yok
      return NextResponse.json({ tamam: true });
    }
    // Farklı fotoğrafa geçiş: eski -1, yeni +1
    await prisma.$transaction([
      prisma.albumFoto.update({
        where: { id: mevcutOy.fotoId },
        data: { oylamaSayisi: { decrement: 1 } },
      }),
      prisma.albumFoto.update({
        where: { id: foto.id },
        data: { oylamaSayisi: { increment: 1 } },
      }),
      prisma.albumFotoOylama.update({
        where: { davetiyeId_oturumId: { davetiyeId: davetiye.id, oturumId: sonuc.data.oturumId } },
        data: { fotoId: foto.id },
      }),
    ]);
  } else {
    // İlk oy
    await prisma.$transaction([
      prisma.albumFoto.update({
        where: { id: foto.id },
        data: { oylamaSayisi: { increment: 1 } },
      }),
      prisma.albumFotoOylama.create({
        data: { fotoId: foto.id, davetiyeId: davetiye.id, oturumId: sonuc.data.oturumId },
      }),
    ]);
  }

  return NextResponse.json({ tamam: true });
}
