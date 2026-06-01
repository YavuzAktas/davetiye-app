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
    <nav className="sticky top-16 z-40 -mx-4 border-b border-gray-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-5xl">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinkleri.map(link => {
            const isAktif = aktif === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-black shadow-sm transition-colors ${
                  isAktif
                    ? "border-transparent bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-sm shadow-purple-200"
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
