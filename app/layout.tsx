import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavLinks from "@/components/NavLinks";
import Link from "next/link";
import { Dancing_Script, Cormorant_Garamond } from "next/font/google";

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
          {/* Navigasyon */}
          <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">D</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Davetim</span>
              </Link>
              <NavLinks />
            </div>
          </nav>

          {/* Sayfa İçeriği */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-6xl mx-auto px-4 py-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                
                {/* Logo & Açıklama */}
                <div className="md:col-span-2">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">D</span>
                    </div>
                    <span className="text-xl font-bold text-white">Davetim</span>
                  </Link>
                  <p className="text-sm leading-relaxed mb-5 max-w-xs">
                    Türkiye&apos;nin dijital davetiye platformu. Düğün, nişan, doğum günü ve daha fazlası için özel davetiye oluşturun.
                  </p>
                  
                  {/* Sosyal Medya İkonları (Düzeltildi) */}
                  <div className="flex gap-3">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors text-sm"
                    >
                      📸
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors text-sm"
                    >
                      🐦
                    </a>
                    <a
                      href="https://wa.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors text-sm"
                    >
                      💬
                    </a>
                  </div>
                </div>

                {/* Platform */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-sm">Platform</h3>
                  <ul className="space-y-2.5">
                    {[
                      { href: "/sablonlar", isim: "Şablonlar" },
                      { href: "/fiyatlar", isim: "Fiyatlar" },
                      { href: "/dashboard", isim: "Dashboard" },
                      { href: "/giris", isim: "Giriş Yap" },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm hover:text-white transition-colors"
                        >
                          {link.isim}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Yasal */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-sm">Yasal</h3>
                  <ul className="space-y-2.5">
                    {[
                      { href: "/gizlilik", isim: "Gizlilik Politikası" },
                      { href: "/kullanim-sartlari", isim: "Kullanım Şartları" },
                      { href: "/kvkk", isim: "KVKK" },
                      { href: "/iletisim", isim: "İletişim" },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm hover:text-white transition-colors"
                        >
                          {link.isim}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Alt Bar */}
              <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm">
                  © 2025 Davetim. Tüm hakları saklıdır.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span>🇹🇷</span>
                  <span>Türkiye&apos;de geliştirildi</span>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}