import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function temizAnahtar(anahtar: string) {
  return anahtar.trim().slice(0, 255) || "unknown";
}

export async function ipIzinVer(
  ad: string,
  anahtar: string,
  limit: number,
  pencereMs: number,
): Promise<boolean> {
  const simdi = new Date();
  const sifirAt = new Date(simdi.getTime() + pencereMs);
  const temizAd = ad.trim().slice(0, 100);
  const temizKey = temizAnahtar(anahtar);

  const guncelPencere = await prisma.rateLimitKaydi.updateMany({
    where: {
      ad: temizAd,
      anahtar: temizKey,
      sifirAt: { gt: simdi },
      sayi: { lt: limit },
    },
    data: {
      sayi: { increment: 1 },
    },
  });
  if (guncelPencere.count > 0) return true;

  const sifirlananPencere = await prisma.rateLimitKaydi.updateMany({
    where: {
      ad: temizAd,
      anahtar: temizKey,
      sifirAt: { lte: simdi },
    },
    data: {
      sayi: 1,
      sifirAt,
    },
  });
  if (sifirlananPencere.count > 0) return true;

  try {
    await prisma.rateLimitKaydi.create({
      data: {
        id: randomUUID(),
        ad: temizAd,
        anahtar: temizKey,
        sayi: 1,
        sifirAt,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const eszamanliOlusanPencere = await prisma.rateLimitKaydi.updateMany({
        where: {
          ad: temizAd,
          anahtar: temizKey,
          sifirAt: { gt: simdi },
          sayi: { lt: limit },
        },
        data: {
          sayi: { increment: 1 },
        },
      });
      return eszamanliOlusanPencere.count > 0;
    }
    throw err;
  }

  return true;
}

export function ipAlNextRequest(req: Request): string {
  return (
    (req.headers as Headers).get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req.headers as Headers).get("x-real-ip") ||
    "unknown"
  );
}
