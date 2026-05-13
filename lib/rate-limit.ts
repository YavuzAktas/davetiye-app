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

  const kayit = await prisma.rateLimitKaydi.upsert({
    where: { ad_anahtar: { ad: temizAd, anahtar: temizKey } },
    create: { ad: temizAd, anahtar: temizKey, sayi: 1, sifirAt },
    update: { updatedAt: simdi },
    select: { sayi: true, sifirAt: true },
  });

  if (kayit.sifirAt <= simdi) {
    await prisma.rateLimitKaydi.update({
      where: { ad_anahtar: { ad: temizAd, anahtar: temizKey } },
      data: { sayi: 1, sifirAt },
    });
    return true;
  }

  if (kayit.sayi >= limit) return false;

  await prisma.rateLimitKaydi.update({
    where: { ad_anahtar: { ad: temizAd, anahtar: temizKey } },
    data: { sayi: { increment: 1 } },
  });
  return true;
}

export function ipAlNextRequest(req: Request): string {
  return (
    (req.headers as Headers).get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req.headers as Headers).get("x-real-ip") ||
    "unknown"
  );
}
