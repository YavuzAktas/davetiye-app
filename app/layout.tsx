import type { Metadata } from "next";
import { Geist, Dancing_Script, Cormorant_Garamond } from "next/font/google";
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

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "Online Davetiye Oluştur | Bekleriz",
    template: "%s | Bekleriz",
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
    title: "Online Davetiye Oluştur | Bekleriz",
    description: "Düğün, nişan, doğum günü için dijital davetiye oluştur. WhatsApp ile paylaş, RSVP yanıtlarını takip et.",
    url: SITE_URL,
    siteName: "Bekleriz",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Davetiye Oluştur | Bekleriz",
    description: "Düğün, nişan, doğum günü için dijital davetiye oluştur.",
  },
  icons: { icon: "/favicon.ico" },
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
    name: "Bekleriz",
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    description: "Türkiye'nin online davetiye platformu — düğün, nişan, doğum günü için dijital davetiye oluşturun.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "destek@bekleriz.com",
      contactType: "customer service",
      availableLanguage: "Turkish",
    },
  };
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Bekleriz",
    url: SITE_URL,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    inLanguage: "tr-TR",
    description: "Düğün, nişan, doğum günü ve özel etkinlikler için online davetiye oluşturma platformu.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TRY",
      lowPrice: "0",
      highPrice: "599",
      offerCount: "3",
    },
  };

  return (
    <html lang="tr">
      <body className={`${geist.className} ${dancingScript.variable} ${cormorant.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
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
