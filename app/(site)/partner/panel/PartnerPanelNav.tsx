"use client";

import { useEffect, useMemo, useState } from "react";

const NAV_LINKLERI = [
  { href: "#kurulum", label: "Kurulum", abonelikGerekli: false },
  { href: "#lead-crm", label: "Lead CRM", abonelikGerekli: true },
  { href: "#segmentler", label: "Segmentler", abonelikGerekli: true },
  { href: "#salon-takvimi", label: "Takvim", abonelikGerekli: true },
  { href: "#analitik", label: "Analitik", abonelikGerekli: true },
  { href: "#paketler", label: "Paketler", abonelikGerekli: true },
  { href: "#whatsapp-asistani", label: "WhatsApp", abonelikGerekli: true },
  { href: "#aktivasyon-kodlari", label: "Aktivasyon", abonelikGerekli: true },
  { href: "#teslim-raporu", label: "Teslim Raporu", abonelikGerekli: true },
  { href: "#operasyon", label: "Operasyon", abonelikGerekli: true },
  { href: "#satis", label: "Satış", abonelikGerekli: true },
  { href: "#marka", label: "Marka", abonelikGerekli: false },
  { href: "#teklif", label: "Teklif", abonelikGerekli: true },
  { href: "#odeme", label: "Ödeme", abonelikGerekli: false },
];

export default function PartnerPanelNav({ abonelikVar }: { abonelikVar: boolean }) {
  const [aktif, setAktif] = useState<string>("#kurulum");
  const navLinkleri = useMemo(
    () => NAV_LINKLERI.filter(link => !link.abonelikGerekli || abonelikVar),
    [abonelikVar]
  );

  useEffect(() => {
    if (!navLinkleri.some(link => link.href === aktif)) {
      setAktif("#kurulum");
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

  return (
    <nav className="sticky top-0 z-30 -mx-4 border-b border-gray-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:top-0">
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
