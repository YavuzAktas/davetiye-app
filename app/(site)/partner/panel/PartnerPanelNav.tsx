const NAV_LINKLERI = [
  { href: "#kurulum", label: "Kurulum" },
  { href: "#ozet", label: "Özet" },
  { href: "#donusum", label: "Dönüşüm" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#satis", label: "Satış" },
  { href: "#marka", label: "Marka" },
  { href: "#teklif", label: "Teklif" },
  { href: "#aktivasyon-kodlari", label: "Aktivasyon" },
  { href: "#odeme", label: "Ödeme" },
];

export default function PartnerPanelNav() {
  return (
    <nav className="sticky top-0 z-30 -mx-4 border-b border-gray-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:top-0">
      <div className="mx-auto max-w-5xl">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_LINKLERI.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-black text-gray-600 shadow-sm transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
