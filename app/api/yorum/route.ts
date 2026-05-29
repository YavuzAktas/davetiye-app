import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — onaylanmış yorumları döndür
export async function GET() {
  const yorumlar = await prisma.yorum.findMany({
    where: { onaylandi: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, ad: true, sehir: true, etkinlikTuru: true, yorum: true, puan: true, createdAt: true },
  });
  return NextResponse.json(yorumlar);
}

// POST — yeni yorum gönder (IP başına saatlik 3 limit)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // IP bazlı rate limit: saatte 3 yorum
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] ?? "").trim()
    || req.headers.get("x-real-ip")
    || "unknown";
  const now = new Date();
  const pencereSonu = new Date(now.getTime() + 60 * 60 * 1000);

  const rl = await prisma.rateLimitKaydi.findUnique({
    where: { ad_anahtar: { ad: "yorum-gonder", anahtar: ip } },
  });

  if (rl && rl.sifirAt > now && rl.sayi >= 3) {
    const kalan = Math.ceil((rl.sifirAt.getTime() - now.getTime()) / 60000);
    return NextResponse.json(
      { hata: `Çok fazla deneme. ${kalan} dakika sonra tekrar deneyin.` },
      { status: 429 }
    );
  }

  if (!rl || rl.sifirAt <= now) {
    await prisma.rateLimitKaydi.upsert({
      where: { ad_anahtar: { ad: "yorum-gonder", anahtar: ip } },
      create: { ad: "yorum-gonder", anahtar: ip, sayi: 1, sifirAt: pencereSonu },
      update: { sayi: 1, sifirAt: pencereSonu },
    });
  } else {
    await prisma.rateLimitKaydi.update({
      where: { ad_anahtar: { ad: "yorum-gonder", anahtar: ip } },
      data: { sayi: { increment: 1 } },
    });
  }

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
