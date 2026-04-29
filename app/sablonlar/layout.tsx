import type { Metadata } from "next";

const SITE_URL = "https://davetiye-app.vercel.app";

export const metadata: Metadata = {
  title: "Davetiye Şablonları",
  description:
    "Düğün, nişan, doğum günü, kına gecesi ve daha fazlası için hazır dijital davetiye şablonları. Dakikalar içinde özelleştir, WhatsApp ile paylaş.",
  keywords: [
    "davetiye şablonu", "düğün davetiyesi şablonu", "nişan davetiyesi tasarımı",
    "doğum günü davetiyesi", "dijital davetiye şablon", "kına davetiyesi",
    "online davetiye hazır şablon", "ücretsiz davetiye şablonu",
  ],
  alternates: { canonical: `${SITE_URL}/sablonlar` },
  openGraph: {
    title: "Davetiye Şablonları | Davetim",
    description: "Düğün, nişan, doğum günü için hazır dijital davetiye şablonları. Dakikalar içinde özelleştir.",
    url: `${SITE_URL}/sablonlar`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
};

export default function SablonlarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
