import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Davetim — Online Davetiye Platformu",
  description: "Düğün, nişan, doğum günü için özel online davetiye oluştur.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={geist.className}>

        {/* Navigasyon */}
        <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-purple-600">
              Davetim
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/sablonlar" className="text-sm text-gray-600 hover:text-gray-900">
                Şablonlar
              </Link>
              <Link href="/fiyatlar" className="text-sm text-gray-600 hover:text-gray-900">
                Fiyatlar
              </Link>
              <Link
                href="/giris"
                className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
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

      </body>
    </html>
  );
}