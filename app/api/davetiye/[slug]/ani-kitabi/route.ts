import https from "https";
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

const MAX_IMAGE_REDIRECTS = 3;
const MAX_IMAGE_BYTES = 8_000_000;
const ALLOWED_IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const ALLOWED_BLOB_HOST_SUFFIXES = [
  ".public.blob.vercel-storage.com",
  ".blob.vercel-storage.com",
];

function guvenliBlobUrl(url: string): URL | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    if (!ALLOWED_BLOB_HOST_SUFFIXES.some((suffix) => parsed.hostname.endsWith(suffix))) return null;
    return parsed;
  } catch {
    return null;
  }
}

/* Node.js https ile fotoğrafı base64 data URI'ye çevirir.
   Native fetch yerine bu modül Vercel serverless'ta daha güvenilir. */
function toDataUri(url: string, redirectCount = 0): Promise<string | null> {
  return new Promise((resolve) => {
    const parsedUrl = guvenliBlobUrl(url);
    if (!parsedUrl || redirectCount > MAX_IMAGE_REDIRECTS) {
      resolve(null);
      return;
    }

    const req = https.get(parsedUrl, (res) => {
      // 3xx redirect'i takip et
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        const nextUrl = new URL(res.headers.location, parsedUrl).toString();
        resolve(toDataUri(nextUrl, redirectCount + 1));
        return;
      }
      if (res.statusCode !== 200) {
        console.error("[ani-kitabi] image HTTP", res.statusCode, url.slice(0, 80));
        res.resume();
        resolve(null);
        return;
      }
      const contentLength = Number(res.headers["content-length"] ?? 0);
      const mime = (res.headers["content-type"] ?? "image/jpeg").split(";")[0].trim().toLowerCase();
      if ((contentLength && contentLength > MAX_IMAGE_BYTES) || !ALLOWED_IMAGE_MIME.has(mime)) {
        console.error("[ani-kitabi] image rejected", mime, contentLength, url.slice(0, 80));
        res.resume();
        resolve(null);
        return;
      }

      const chunks: Buffer[] = [];
      let toplamByte = 0;
      let boyutAsildi = false;
      res.on("data", (c: Buffer) => {
        toplamByte += c.length;
        if (toplamByte > MAX_IMAGE_BYTES) {
          boyutAsildi = true;
          req.destroy();
          resolve(null);
          return;
        }
        chunks.push(c);
      });
      res.on("end", async () => {
        if (boyutAsildi) return;
        try {
          const buf  = Buffer.concat(chunks);
          // react-pdf desteklemediği için webp/avif → jpeg dönüştür
          if (mime === "image/webp" || mime === "image/avif" || mime === "image/gif") {
            const jpeg = await sharp(buf).jpeg({ quality: 92 }).toBuffer();
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
        id: true, userId: true, baslik: true, kisi1: true, kisi2: true, aniKitabiAktif: true, odemeDurumu: true,
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

    if (!davetiye.aniKitabiAktif || davetiye.odemeDurumu !== "odendi") {
      return NextResponse.json({ hata: "Bu davetiyede Anı Kitabı PDF özelliği aktif değil." }, { status: 403 });
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
    return NextResponse.json({ hata: "PDF oluşturulamadı." }, { status: 500 });
  }
}
