import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { dogrulaGorselDosya } from "@/lib/dosya-dogrulama";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    select: { id: true, durum: true },
  });

  if (!partner || partner.durum !== "aktif") {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json({ hata: "Depolama yapılandırılmamış." }, { status: 503 });

  const form = await req.formData();
  const dosya = form.get("dosya") as File | null;

  if (!dosya) return NextResponse.json({ hata: "Dosya gerekli." }, { status: 400 });
  if (dosya.size > 2_000_000) return NextResponse.json({ hata: "Logo max 2 MB." }, { status: 400 });

  const guvenliDosya = await dogrulaGorselDosya(dosya);
  if (!guvenliDosya) {
    return NextResponse.json(
      { hata: "Sadece JPG, PNG veya WEBP dosyası kabul edilir." },
      { status: 400 }
    );
  }

  const blob = await put(
    `partner-logo/${partner.id}/logo.${guvenliDosya.ext}`,
    guvenliDosya.blob,
    { access: "public" }
  );

  await prisma.partner.update({
    where: { id: partner.id },
    data: { logoUrl: blob.url },
  });

  return NextResponse.json({ logoUrl: blob.url });
}
