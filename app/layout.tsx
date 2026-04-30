import type { Metadata } from "next";
import { Geist, Dancing_Script, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavFooterWrapper from "@/components/NavFooterWrapper";

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

const SITE_URL = process.env.NEXT_PUBLIC_URL ?? "https://bekleriz.com";

export const metadata: Metadata = {
  title: {
    default: "Bekleriz — Online Davetiye Platformu",
    template: "%s | Bekleriz",
  },
  description:
    "Düğün, nişan, doğum günü ve daha fazlası için dakikalar içinde özel online davetiye oluştur. WhatsApp ile tek tıkla paylaş, RSVP takip et.",
  keywords: [
    "online davetiye", "dijital davetiye", "düğün davetiyesi",
    "nişan davetiyesi", "doğum günü davetiyesi", "davetiye oluştur",
    "ücretsiz davetiye", "davetiye şablonu", "whatsapp davetiye",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Bekleriz — Online Davetiye Platformu",
    description: "Düğün, nişan, doğum günü için dakikalar içinde özel online davetiye oluştur. WhatsApp ile tek tıkla paylaş.",
    url: SITE_URL,
    siteName: "Bekleriz",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bekleriz — Online Davetiye Platformu",
    description: "Düğün, nişan, doğum günü için özel online davetiye oluştur.",
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

  return (
    <html lang="tr">
      <body className={`${geist.className} ${dancingScript.variable} ${cormorant.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Providers>
          <NavFooterWrapper>
            {children}
          </NavFooterWrapper>
        </Providers>
      </body>
    </html>
  );
}