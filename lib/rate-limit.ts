/**
 * Module-level in-memory IP rate limiter.
 * Vercel warm instance'larında etkilidir; cold start'ta sayaç sıfırlanır.
 * Her limiter adı bağımsız bir pencere tutar.
 */
const haritalar = new Map<string, Map<string, { sayi: number; sifirAt: number }>>();

export function ipIzinVer(
  ad: string,
  ip: string,
  limit: number,
  pencereMs: number,
): boolean {
  if (!haritalar.has(ad)) haritalar.set(ad, new Map());
  const harita = haritalar.get(ad)!;

  const simdi = Date.now();
  const kayit = harita.get(ip);

  if (!kayit || simdi > kayit.sifirAt) {
    harita.set(ip, { sayi: 1, sifirAt: simdi + pencereMs });
    return true;
  }
  if (kayit.sayi >= limit) return false;
  kayit.sayi++;
  return true;
}

export function ipAlNextRequest(req: Request): string {
  return (
    (req.headers as Headers).get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req.headers as Headers).get("x-real-ip") ||
    "unknown"
  );
}
