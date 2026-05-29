import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — onaylanmış yorumları döndür
export async function GET() {
  const yorumlar = await prisma.yorum.findMany({
    where: { onaylandi: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, ad: true, sehir: true, etkinlikTuru: true, yorum: true, puan: true, createdAt: true },
  });
  return NextResponse.json(yorumlar);
}

// POST — yeni yorum gönder (kullanıcı başına günlük 1 limit)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  const { ad, sehir, etkinlikTuru, yorum, puan } = body as {
    ad: string;
    sehir?: string;
    etkinlikTuru: string;
    yorum: string;
    puan?: number;
  };

  if (!ad?.trim() || !etkinlikTuru?.trim() || !yorum?.trim()) {
    return NextResponse.json({ hata: "Zorunlu alanlar eksik" }, { status: 400 });
  }
  if (yorum.trim().length < 20) {
    return NextResponse.json({ hata: "Yorum en az 20 karakter olmalı" }, { status: 400 });
  }
  if (yorum.trim().length > 500) {
    return NextResponse.json({ hata: "Yorum en fazla 500 karakter olabilir" }, { status: 400 });
  }

  const yeniYorum = await prisma.yorum.create({
    data: {
      ad: ad.trim().slice(0, 60),
      sehir: sehir?.trim().slice(0, 40) || null,
      etkinlikTuru: etkinlikTuru.trim().slice(0, 40),
      yorum: yorum.trim(),
      puan: Math.min(5, Math.max(1, puan ?? 5)),
      userId: session?.user?.id ?? null,
      onaylandi: false,
    },
  });

  return NextResponse.json({ id: yeniYorum.id, mesaj: "Yorumunuz alındı, inceleme sonrası yayına alınacak." }, { status: 201 });
}
