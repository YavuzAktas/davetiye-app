"use client";

import { usePathname } from "next/navigation";
import NavLinks from "./NavLinks";
import Link from "next/link";

export default function NavFooterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDavetiye = pathname.startsWith("/davetiye/");

  return (
    <>
      {!isDavetiye && (
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
      )}

      <main>{children}</main>

      {!isDavetiye && (
        <footer className="bg-gray-900 text-gray-400">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
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
                <div className="flex gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors text-sm">📸</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors text-sm">🐦</a>
                  <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors text-sm">💬</a>
                </div>
              </div>

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
                      <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.isim}</Link>
                    </li>
                  ))}
                </ul>
              </div>

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
                      <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.isim}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm">© 2025 Davetim. Tüm hakları saklıdır.</p>
              <div className="flex items-center gap-2 text-sm">
                <span>🇹🇷</span>
                <span>Türkiye&apos;de geliştirildi</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}