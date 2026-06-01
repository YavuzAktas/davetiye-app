"use client";

import { useEffect, useMemo, useState } from "react";

const NAV_LINKLERI = [
  { href: "#ozet", label: "Özet", aciklama: "Bugünün işleri", abonelikGerekli: false },
  { href: "#satis-akisi", label: "Satış", aciklama: "Müşteri ve teklif", abonelikGerekli: true },
  { href: "#teslim-akisi", label: "Teslim", aciklama: "Link ve rapor", abonelikGerekli: true },
  { href: "#operasyon-akisi", label: "Operasyon", aciklama: "Takvim ve ekip", abonelikGerekli: true },
  { href: "#ayarlar-akisi", label: "Ayarlar", aciklama: "Marka ve ödeme", abonelikGerekli: false },
];

export default function PartnerPanelNav({ abonelikVar }: { abonelikVar: boolean }) {
  const [aktif, setAktif] = useState<string>("#ozet");
  const navLinkleri = useMemo(
    () => NAV_LINKLERI.filter(link => !link.abonelikGerekli || abonelikVar),
    [abonelikVar]
  );

  useEffect(() => {
    if (!navLinkleri.some(link => link.href === aktif)) {
      setAktif("#ozet");
    }
  }, [aktif, navLinkleri]);

  useEffect(() => {
    const ids = navLinkleri.map(l => l.href.slice(1));
    const elementler = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      entries => {
        const gorunen = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (gorunen.length > 0) {
          setAktif(`#${gorunen[0].target.id}`);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    elementler.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [navLinkleri]);

  const aktifLink = navLinkleri.find(link => link.href === aktif) ?? navLinkleri[0];

  function bolumeGit(href: string) {
    setAktif(href);
    const hedef = document.getElementById(href.slice(1));
    if (hedef) {
      hedef.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    }
  }

  return (
    <nav className="sticky top-16 z-40 -mx-4 border-b border-gray-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-5xl">
        <div className="sm:hidden">
          <label htmlFor="partner-panel-bolum" className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">
            Panel bölümü
          </label>
          <div className="relative">
            <select
              id="partner-panel-bolum"
              value={aktifLink.href}
              onChange={event => bolumeGit(event.target.value)}
              className="h-12 w-full appearance-none rounded-2xl border border-purple-100 bg-white px-4 pr-11 text-sm font-black text-gray-900 shadow-sm outline-none transition-colors focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
            >
              {navLinkleri.map(link => (
                <option key={link.href} value={link.href}>
                  {link.label} - {link.aciklama}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">⌄</span>
          </div>
        </div>

        <div className="hidden gap-2 overflow-x-auto pb-1 sm:flex [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinkleri.map(link => {
            const isAktif = aktif === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-black shadow-sm transition-colors ${
                  isAktif
                    ? "border-purple-200 bg-purple-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
