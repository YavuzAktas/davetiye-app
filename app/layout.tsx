import type { Metadata } from "next";
import { Geist, Dancing_Script, Cormorant_Garamond, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import CerezBanner from "@/components/CerezBanner";
import { getSiteUrl } from "@/lib/site-url";

const geist = Geist({ subsets: ["latin"] });
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["400", "700"],
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "Online Davetiye Oluştur | DavetRota",
    template: "%s | DavetRota",
  },
  description:
    "Düğün, nişan, doğum günü ve özel etkinlikler için online davetiye oluştur. Dijital davetiyeni WhatsApp ile paylaş, RSVP yanıtlarını takip et.",
  keywords: [
    "online davetiye", "dijital davetiye", "düğün davetiyesi",
    "nişan davetiyesi", "doğum günü davetiyesi", "davetiye oluştur",
    "ücretsiz davetiye", "davetiye şablonu", "whatsapp davetiye",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Online Davetiye Oluştur | DavetRota",
    description: "Düğün, nişan, doğum günü için dijital davetiye oluştur. WhatsApp ile paylaş, RSVP yanıtlarını takip et.",
    url: SITE_URL,
    siteName: "DavetRota",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Davetiye Oluştur | DavetRota",
    description: "Düğün, nişan, doğum günü için dijital davetiye oluştur.",
  },
  icons: { icon: "/favicon.ico" },
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DavetRota",
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    description: "Türkiye'nin online davetiye platformu — düğün, nişan, doğum günü için dijital davetiye oluşturun.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "destek@davetrota.com",
      contactType: "customer service",
      availableLanguage: "Turkish",
    },
  };
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DavetRota",
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    description: "Türkiye'nin online davetiye platformu — düğün, nişan, doğum günü için dijital davetiye oluşturun.",
    email: "destek@davetrota.com",
    areaServed: { "@type": "Country", name: "Turkey" },
    availableLanguage: { "@type": "Language", name: "Turkish" },
    priceRange: "₺₺",
  };
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DavetRota",
    url: SITE_URL,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    inLanguage: "tr-TR",
    description: "Düğün, nişan, doğum günü ve özel etkinlikler için online davetiye oluşturma platformu.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TRY",
      lowPrice: "349",
      highPrice: "1700",
      offerCount: "10",
    },
  };

  return (
    <html lang="tr">
      <body className={`${geist.className} ${dancingScript.variable} ${cormorant.variable} ${playfair.variable} ${lora.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
        />
        <Providers>
          {children}
          <CerezBanner />
        </Providers>
      </body>
    </html>
  );
}
