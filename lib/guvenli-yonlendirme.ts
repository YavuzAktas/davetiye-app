const VARSAYILAN_CALLBACK_URL = "/dashboard";
const YEREL_ORIGIN = "https://bekleriz.local";

export function guvenliCallbackUrl(raw: string | null | undefined, fallback = VARSAYILAN_CALLBACK_URL) {
  const deger = raw?.trim();
  if (!deger || !deger.startsWith("/") || deger.startsWith("//") || deger.includes("\\")) {
    return fallback;
  }

  try {
    const url = new URL(deger, YEREL_ORIGIN);
    if (url.origin !== YEREL_ORIGIN) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
