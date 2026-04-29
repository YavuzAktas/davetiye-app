"use client";

import { usePathname } from "next/navigation";
import NavLinks from "./NavLinks";
import Link from "next/link";

export default function NavFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDavetiye = pathname.startsWith("/davetiye/");
  const isGiris = pathname === "/giris";
  const hideChrome = isDavetiye || isGiris;

  return (
    <>
      {!hideChrome && <Header />}
      <main>{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}

/* ─────────────────────────────────────────
   HEADER
───────────────────────────────────────── */
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl">
      {/* İnce gradient alt çizgi */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-300/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-pink-500 rounded-xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-8 h-8 bg-linear-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">D</span>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Davetim</span>
          </Link>

          {/* Nav Links */}
          <NavLinks />
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
const PLATFORM_LINKS = [
  { href: "/sablonlar", label: "Şablonlar" },
  { href: "/fiyatlar", label: "Fiyatlar" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/giris", label: "Giriş Yap" },
];

const YASAL_LINKS = [
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
  { href: "/kvkk", label: "KVKK" },
  { href: "/iletisim", label: "İletişim" },
];

function Footer() {
  return (
    <footer className="bg-[#0c0118] text-white">

      {/* Üst: CTA şeridi */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p
              className="text-3xl md:text-4xl text-white/90 mb-1"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              Davetiyeni bugün oluştur
            </p>
            <p className="text-sm text-white/30">Ücretsiz başla · Kredi kartı gerekmez</p>
          </div>
          <Link
            href="/sablonlar"
            className="shrink-0 group flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold px-7 py-3.5 rounded-2xl hover:opacity-90 hover:shadow-2xl hover:shadow-purple-900/40 hover:-translate-y-0.5 transition-all"
          >
            Şablonlara Bak
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Marka */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-7 h-7 bg-linear-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">D</span>
              </div>
              <span className="font-bold text-white/90">Davetim</span>
            </Link>
            <p className="text-white/30 text-sm leading-relaxed mb-5 max-w-50">
              Türkiye&apos;nin dijital davetiye platformu.
            </p>
            <div className="flex gap-2.5">
              <SocialIcon href="https://instagram.com" label="Instagram" path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              <SocialIcon href="https://twitter.com" label="X" path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              <SocialIcon href="https://wa.me" label="WhatsApp" path="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[10px] font-semibold text-white/20 tracking-[0.2em] uppercase mb-5">Platform</p>
            <ul className="space-y-3.5">
              {PLATFORM_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/40 hover:text-white transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <p className="text-[10px] font-semibold text-white/20 tracking-[0.2em] uppercase mb-5">Yasal</p>
            <ul className="space-y-3.5">
              {YASAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/40 hover:text-white transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Özet stat */}
          <div>
            <p className="text-[10px] font-semibold text-white/20 tracking-[0.2em] uppercase mb-5">Rakamlar</p>
            <div className="space-y-4">
              {[
                { n: "500+", l: "Davetiye oluşturuldu" },
                { n: "%98", l: "Memnuniyet" },
                { n: "3 dk", l: "Oluşturma süresi" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p className="text-lg font-bold text-white/80">{n}</p>
                  <p className="text-xs text-white/25">{l}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Alt bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20">© 2025 Davetim. Tüm hakları saklıdır.</p>
          <p className="text-xs text-white/20 flex items-center gap-1.5">
            <span>🇹🇷</span> Türkiye&apos;de geliştirildi
          </p>
        </div>
      </div>

    </footer>
  );
}

function SocialIcon({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all"
    >
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  );
}
