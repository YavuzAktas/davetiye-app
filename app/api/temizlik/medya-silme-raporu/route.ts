import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cronSecretEksik, cronYetkiliMi } from "@/lib/cron-auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (cronSecretEksik()) {
    return NextResponse.json(
      { hata: "Temizlik raporu yapılandırılmamış." },
      { status: 503 },
    );
  }

  if (!cronYetkiliMi(req.headers.get("authorization"))) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const simdi = new Date();
  const [ozet, zamaniGelen, sonHatalar] = await Promise.all([
    prisma.medyaSilmeKuyrugu.aggregate({
      _count: { id: true },
      _min: { createdAt: true },
      _max: { denemeSayisi: true, createdAt: true },
    }),
    prisma.medyaSilmeKuyrugu.count({
      where: {
        OR: [
          { sonrakiDeneme: null },
          { sonrakiDeneme: { lte: simdi } },
        ],
      },
    }),
    prisma.medyaSilmeKuyrugu.findMany({
      orderBy: [
        { denemeSayisi: "desc" },
        { createdAt: "asc" },
      ],
      take: 20,
      select: {
        dosyaUrl: true,
        kaynak: true,
        denemeSayisi: true,
        sonHata: true,
        sonrakiDeneme: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    basarili: true,
    toplamBekleyen: ozet._count.id,
    yenidenDenenecek: zamaniGelen,
    enEskiKayitTarihi: ozet._min.createdAt?.toISOString() ?? null,
    sonKayitTarihi: ozet._max.createdAt?.toISOString() ?? null,
    enYuksekDenemeSayisi: ozet._max.denemeSayisi ?? 0,
    sonHatalar: sonHatalar.map(kayit => ({
      dosyaUrl: kayit.dosyaUrl,
      kaynak: kayit.kaynak,
      denemeSayisi: kayit.denemeSayisi,
      sonHata: kayit.sonHata,
      sonrakiDeneme: kayit.sonrakiDeneme?.toISOString() ?? null,
      createdAt: kayit.createdAt.toISOString(),
      updatedAt: kayit.updatedAt.toISOString(),
    })),
    tarih: simdi.toISOString(),
  });
}
