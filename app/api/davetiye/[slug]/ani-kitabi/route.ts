import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { AniKitabiPDF, type AniKitabiVeri } from "@/lib/ani-kitabi/pdf";
import { SABLONLAR } from "@/lib/sablonlar";

export const maxDuration = 60;

interface Props { params: Promise<{ slug: string }> }

/* Fotoğrafı base64 data URI'ye çevirir — PDF render ederken network yoktur */
async function toDataUri(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest, { params }: Props) {
  const { slug } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ hata: "Kullanıcı bulunamadı" }, { status: 401 });

    const davetiye = await prisma.davetiye.findUnique({
      where: { slug },
      select: {
        id: true, userId: true, baslik: true, kisi1: true, kisi2: true,
        tarih: true, mekan: true, etkinlikTur: true, sablon: true,
        albumFotolar: {
          where: { onaylandi: true },
          orderBy: { createdAt: "asc" },
          select: { id: true, yukleyenAd: true, dosyaUrl: true, createdAt: true },
        },
        aniDefterleri: {
          where: { onaylandi: true },
          orderBy: { createdAt: "asc" },
          select: { id: true, yazarAd: true, icerik: true, createdAt: true },
        },
        sesliAnilar: {
          where: { onaylandi: true },
          orderBy: { createdAt: "asc" },
          select: { id: true, adSoyad: true, sure: true, createdAt: true },
        },
      },
    });

    if (!davetiye || davetiye.userId !== user.id) {
      return NextResponse.json({ hata: "Bulunamadı" }, { status: 404 });
    }

    const sablon = SABLONLAR.find((s) => s.id === davetiye.sablon) ?? SABLONLAR[0];

    /* Fotoğrafları paralel olarak data URI'ye çevir */
    const fotolarWithData = await Promise.all(
      davetiye.albumFotolar.map(async (f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
        imageData: await toDataUri(f.dosyaUrl),
      }))
    );

    const veri: AniKitabiVeri = {
      baslik:      davetiye.baslik,
      kisi1:       davetiye.kisi1,
      kisi2:       davetiye.kisi2,
      tarih:       davetiye.tarih?.toISOString() ?? null,
      mekan:       davetiye.mekan,
      etkinlikTur: davetiye.etkinlikTur,
      renk:        sablon.renk,
      fotolar:     fotolarWithData,
      anilar:      davetiye.aniDefterleri.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
      sesliAnilar: davetiye.sesliAnilar.map((s)    => ({ ...s, createdAt: s.createdAt.toISOString() })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer: Buffer = await renderToBuffer(createElement(AniKitabiPDF, { v: veri }) as any);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ani-kitabi-${slug}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[ani-kitabi] hata:", msg);
    return NextResponse.json({ hata: "PDF oluşturulamadı", detay: msg }, { status: 500 });
  }
}
