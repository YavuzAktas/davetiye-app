import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    select: {
      id: true,
      userId: true,
      baslik: true,
      albumFotolar: {
        where: { onaylandi: true },
        orderBy: { createdAt: "asc" },
        select: { id: true, dosyaUrl: true, yukleyenAd: true, createdAt: true },
      },
    },
  });

  if (!davetiye || davetiye.userId !== session.user.id)
    return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  if (davetiye.albumFotolar.length === 0)
    return NextResponse.json({ hata: "İndirilecek onaylı fotoğraf yok." }, { status: 404 });

  // ZIP'e en fazla 200 fotoğraf al (güvenlik limiti)
  const fotolar = davetiye.albumFotolar.slice(0, 200);

  const zip = new JSZip();
  const klasor = zip.folder("fotolar")!;

  // Paralel fetch — en fazla 10 eş zamanlı istek
  const BATCH = 10;
  for (let i = 0; i < fotolar.length; i += BATCH) {
    const grup = fotolar.slice(i, i + BATCH);
    await Promise.all(
      grup.map(async (foto, j) => {
        try {
          const res = await fetch(foto.dosyaUrl);
          if (!res.ok) return;
          const buffer = await res.arrayBuffer();
          const sira = String(i + j + 1).padStart(3, "0");
          const temizAd = foto.yukleyenAd.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ _-]/g, "").slice(0, 40);
          klasor.file(`${sira}_${temizAd}.webp`, buffer);
        } catch {
          // Tek bir fotoğraf başarısız olursa devam et
        }
      })
    );
  }

  const zipBuffer = await zip.generateAsync({ type: "arraybuffer", compression: "DEFLATE", compressionOptions: { level: 3 } });
  const zipBlob = new Blob([zipBuffer], { type: "application/zip" });

  const dosyaAdi = `${slug}-fotolar.zip`.replace(/[^a-zA-Z0-9._-]/g, "-");

  return new NextResponse(zipBlob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${dosyaAdi}"`,
      "Content-Length": String(zipBuffer.byteLength),
    },
  });
}
