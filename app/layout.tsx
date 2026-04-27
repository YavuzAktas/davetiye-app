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

export const metadata: Metadata = {
  title: {
    default: "Davetim — Online Davetiye Platformu",
    template: "%s | Davetim",
  },
  description:
    "Düğün, nişan, doğum günü ve daha fazlası için dakikalar içinde özel online davetiye oluştur. WhatsApp ile tek tıkla paylaş.",
  keywords: ["online davetiye", "dijital davetiye", "düğün davetiyesi"],
  openGraph: {
    title: "Davetim — Online Davetiye Platformu",
    description: "Düğün, nişan, doğum günü için özel online davetiye oluştur.",
    url: "https://davetiye-app.vercel.app",
    siteName: "Davetim",
    locale: "tr_TR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${geist.className} ${dancingScript.variable} ${cormorant.variable}`}>
        <Providers>
          <NavFooterWrapper>
            {children}
          </NavFooterWrapper>
        </Providers>
      </body>
    </html>
  );
}