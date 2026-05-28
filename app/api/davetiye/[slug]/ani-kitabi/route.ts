import https from "https";
import http  from "http";
import sharp from "sharp";
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

/* Node.js https/http ile fotoğrafı base64 data URI'ye çevirir.
   Native fetch yerine bu modül Vercel serverless'ta daha güvenilir. */
function toDataUri(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, (res) => {
      // 3xx redirect'i takip et
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(toDataUri(res.headers.location));
        return;
      }
      if (res.statusCode !== 200) {
        console.error("[ani-kitabi] image HTTP", res.statusCode, url.slice(0, 80));
        res.resume();
        resolve(null);
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", async () => {
        try {
          const buf  = Buffer.concat(chunks);
          const mime = (res.headers["content-type"] ?? "image/jpeg").split(";")[0].trim();
          // react-pdf desteklemediği için webp/avif → jpeg dönüştür
          if (mime === "image/webp" || mime === "image/avif" || mime === "image/gif") {
            const jpeg = await sharp(buf).jpeg({ quality: 85 }).toBuffer();
            resolve(`data:image/jpeg;base64,${jpeg.toString("base64")}`);
          } else {
            resolve(`data:${mime};base64,${buf.toString("base64")}`);
          }
        } catch (e) {
          console.error("[ani-kitabi] sharp convert error", e);
          resolve(null);
        }
      });
      res.on("error", (e) => { console.error("[ani-kitabi] image stream", e.message); resolve(null); });
    });
    req.setTimeout(10_000, () => { req.destroy(); console.error("[ani-kitabi] image timeout", url.slice(0,80)); resolve(null); });
    req.on("error", (e) => { console.error("[ani-kitabi] image req error", e.message); resolve(null); });
  });
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
