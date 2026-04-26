import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "./providers";
import NavLinks from "@/components/NavLinks";



const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Davetim — Online Davetiye Platformu",
    template: "%s | Davetim",
  },
  description:
    "Düğün, nişan, doğum günü ve daha fazlası için dakikalar içinde özel online davetiye oluştur. WhatsApp ile tek tıkla paylaş.",
  keywords: [
    "online davetiye",
    "dijital davetiye",
    "düğün davetiyesi",
    "nişan davetiyesi",
    "doğum günü davetiyesi",
    "elektronik davetiye",
    "davetiye oluştur",
  ],
  authors: [{ name: "Davetim" }],
  openGraph: {
    title: "Davetim — Online Davetiye Platformu",
    description:
      "Düğün, nişan, doğum günü için özel online davetiye oluştur. WhatsApp ile paylaş.",
    url: "https://davetiye-app.vercel.app",
    siteName: "Davetim",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Davetim — Online Davetiye Platformu",
    description: "Dijital davetiye platformu. Ücretsiz başla.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={geist.className}>
        <Providers>
        {/* Navigasyon */}
        <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-purple-600">
              Davetim
            </Link>
            <NavLinks />
          </div>
        </nav>

        {/* Sayfa içeriği */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-100 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-purple-600 font-semibold">Davetim</span>
            <p className="text-sm text-gray-400">
              © 2025 Davetim. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <Link href="/gizlilik" className="hover:text-gray-600">Gizlilik</Link>
              <Link href="/kullanim-sartlari" className="hover:text-gray-600">Kullanım Şartları</Link>
            </div>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  );
}