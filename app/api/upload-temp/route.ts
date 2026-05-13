import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { dogrulaGorselDosya } from "@/lib/dosya-dogrulama";
import { ipAlNextRequest, ipIzinVer } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const ip = ipAlNextRequest(req);
  if (
    !ipIzinVer("upload-temp-ip", ip, 20, 60 * 60_000) ||
    !ipIzinVer("upload-temp-user", session.user.id, 20, 60 * 60_000)
  ) {
    return NextResponse.json({ hata: "Saatlik yükleme limiti doldu." }, { status: 429 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json({ hata: "Depolama yapılandırılmamış." }, { status: 503 });

  const form = await req.formData();
  const dosya = form.get("dosya") as File | null;

  if (!dosya) return NextResponse.json({ hata: "Dosya gerekli." }, { status: 400 });
  if (dosya.size > 10_000_000) return NextResponse.json({ hata: "Dosya max 10 MB." }, { status: 400 });

  const guvenliDosya = await dogrulaGorselDosya(dosya);
  if (!guvenliDosya) {
    return NextResponse.json({ hata: "Sadece JPG, PNG, WEBP veya GIF dosyası kabul edilir." }, { status: 400 });
  }

  const blob = await put(
    `polaroid/${session.user.id}/${Date.now()}.${guvenliDosya.ext}`,
    guvenliDosya.blob,
    { access: "public" }
  );

  await prisma.geciciYukleme.create({
    data: {
      userId: session.user.id,
      dosyaUrl: blob.url,
      tip: "polaroid",
    },
  });

  return NextResponse.json({ url: blob.url });
}
