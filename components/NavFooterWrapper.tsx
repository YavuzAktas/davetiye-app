"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NavLinks from "./NavLinks";
import Link from "next/link";

export default function NavFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDavetiye = pathname.startsWith("/davetiye/");
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(false);
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const darkNav = isHome && !scrolled;

  return (
    <>
      {!isDavetiye && (
        <nav
          className={`sticky top-0 z-50 transition-all duration-300 ${
            darkNav
              ? "bg-transparent border-b border-white/6"
              : "bg-white/85 backdrop-blur-xl border-b border-gray-100/80 shadow-sm shadow-black/4"
          }`}
        >
          {/* Gradient accent line — sadece açık modda görünür */}
          <div className={`absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-300/40 to-transparent transition-opacity duration-300 ${darkNav ? "opacity-0" : "opacity-100"}`} />

          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white text-sm font-bold">D</span>
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${darkNav ? "text-white" : "text-gray-900"}`}>
                Davetim
              </span>
            </Link>

            <NavLinks dark={darkNav} />
          </div>
        </nav>
      )}

      <main>{children}</main>

      {!isDavetiye && <Footer />}
    </>
  );
}

function Footer() {
  const PLATFORM = [
    { href: "/sablonlar", label: "Şablonlar" },
    { href: "/fiyatlar", label: "Fiyatlar" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/giris", label: "Giriş Yap" },
  ];
  const YASAL = [
    { href: "/gizlilik", label: "Gizlilik Politikası" },
    { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
    { href: "/kvkk", label: "KVKK" },
    { href: "/iletisim", label: "İletişim" },
  ];

  return (
    <footer className="bg-[#080112] relative overflow-hidden">

      {/* Gradient şerit üst kenarda */}
      <div className="h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Arka plan blob'ları */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900 opacity-25 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-900 opacity-15 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-32 bg-violet-900 opacity-10 blur-[60px] pointer-events-none" />

      {/* Dekoratif büyük arka plan yazısı */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span
          className="text-[160px] md:text-[220px] font-bold text-white/[0.018] whitespace-nowrap leading-none"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          Davetim
        </span>
      </div>

      {/* İçerik */}
      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-10">

        {/* Ana grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

          {/* Marka — 2 sütun */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-9 h-9 bg-linear-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50 group-hover:scale-105 transition-transform">
                <span className="text-white text-sm font-bold">D</span>
              </div>
              <span className="text-xl font-bold text-white">Davetim</span>
            </Link>

            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
              Türkiye&apos;nin dijital davetiye platformu. Düğün, nişan, doğum günü ve daha fazlası için özel davetiye oluşturun.
            </p>

            {/* Sosyal medya ikonları */}
            <div className="flex gap-3">
              {[
                {
                  href: "https://instagram.com",
                  label: "Instagram",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                  hover: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500",
                },
                {
                  href: "https://twitter.com",
                  label: "Twitter / X",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                  hover: "hover:bg-gray-700",
                },
                {
                  href: "https://wa.me",
                  label: "WhatsApp",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                  hover: "hover:bg-emerald-600",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-9 h-9 bg-white/5 border border-white/8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:border-transparent transition-all duration-200 ${s.hover}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform linkleri */}
          <div>
            <h3 className="text-white/30 font-semibold text-[10px] tracking-[0.2em] uppercase mb-6">
              Platform
            </h3>
            <ul className="space-y-4">
              {PLATFORM.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-white text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal linkler */}
          <div>
            <h3 className="text-white/30 font-semibold text-[10px] tracking-[0.2em] uppercase mb-6">
              Yasal
            </h3>
            <ul className="space-y-4">
              {YASAL.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-white text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini CTA */}
          <div>
            <h3 className="text-white/30 font-semibold text-[10px] tracking-[0.2em] uppercase mb-6">
              Hızlı Başla
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Dakikalar içinde ilk davetiyeni oluştur.
            </p>
            <Link
              href="/sablonlar"
              className="group inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-purple-900/40 transition-all"
            >
              Ücretsiz Başla
              <span className="group-hover:translate-x-0.5 transition-transform inline-block text-xs">→</span>
            </Link>
          </div>
        </div>

        {/* Alt çizgi + copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2025 Davetim. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>🇹🇷</span>
              <span>Türkiye&apos;de geliştirildi</span>
            </div>
            <div className="w-1 h-1 bg-gray-700 rounded-full" />
            <span className="text-gray-700 text-xs">v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
