type AkisAdimi = {
  baslik: string;
  aciklama: string;
  href: string;
  cta: string;
  durum: "hazir" | "aktif" | "bekliyor";
};

type LeadDurum = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";

type Lead = {
  id: string;
  durum: LeadDurum;
};

export default function PartnerPaketSatisAkisi({
  leadler,
  teklifHazir,
}: {
  leadler: Lead[];
  teklifHazir: boolean;
}) {
  const leadVar = leadler.length > 0;
  const teklifAsamasiVar = leadler.some(lead => ["teklif_gonderildi", "kapora_bekliyor", "kazandi"].includes(lead.durum));
  const anlasmaVar = leadler.some(lead => ["kapora_bekliyor", "kazandi"].includes(lead.durum));

  const adimlar: AkisAdimi[] = [
    {
      baslik: "Müşteri bilgisi",
      aciklama: "Görüşülen kişiyi ve etkinlik tarihini ekleyin.",
      href: "#lead-crm",
      cta: "Müşteri ekle",
      durum: leadVar ? "hazir" : "aktif",
    },
    {
      baslik: "Paket önerisi",
      aciklama: "Hızlı, operasyon, anı veya premium paketi seçin.",
      href: "#satis-asistani",
      cta: "Paket öner",
      durum: leadVar ? (teklifAsamasiVar ? "hazir" : "aktif") : "bekliyor",
    },
    {
      baslik: "Fiyat ve teklif",
      aciklama: "Kârlılığı kontrol edip yazılı teklifi hazırlayın.",
      href: "#teklif",
      cta: "Teklif hazırla",
      durum: teklifHazir || teklifAsamasiVar ? (anlasmaVar ? "hazir" : "aktif") : "bekliyor",
    },
    {
      baslik: "Müşteriye gönder",
      aciklama: "WhatsApp mesajı veya teklif metniyle müşteriye iletin.",
      href: "#whatsapp-asistani",
      cta: "Mesaj hazırla",
      durum: teklifHazir || teklifAsamasiVar ? "aktif" : "bekliyor",
    },
    {
      baslik: "Teslim linki",
      aciklama: "Anlaşma sonrası müşteriye tek kullanımlık teslim linki verin.",
      href: "#aktivasyon-kodlari",
      cta: "Link oluştur",
      durum: anlasmaVar ? "aktif" : "bekliyor",
    },
  ];

  const aktifAdim = adimlar.find(adim => adim.durum === "aktif") ?? adimlar[0];

  return (
    <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
      <div className="grid gap-5 bg-linear-to-br from-purple-50 via-white to-emerald-50 px-5 py-5 sm:px-7 lg:grid-cols-[1fr_300px] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Müşteri paket satışı</p>
          <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
            Bir müşteriyi dijital pakete çevir
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
            Bu bölümdeki tüm araçlar tek satış işine hizmet eder: müşteriyi ekle, doğru paketi seç, fiyatı netleştir, teklif gönder ve anlaşınca teslim linkini üret.
          </p>
        </div>
        <a
          href={aktifAdim.href}
          className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700"
        >
          {aktifAdim.cta}
        </a>
      </div>

      <div className="grid gap-3 p-5 sm:p-7 lg:grid-cols-5">
        {adimlar.map((adim, index) => (
          <a
            key={adim.baslik}
            href={adim.href}
            className={`rounded-3xl border p-4 transition-colors ${
              adim.durum === "hazir"
                ? "border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                : adim.durum === "aktif"
                ? "border-purple-200 bg-purple-50 hover:bg-purple-100"
                : "border-gray-100 bg-gray-50 opacity-80 hover:bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-black ${
                  adim.durum === "hazir"
                    ? "bg-emerald-500 text-white"
                    : adim.durum === "aktif"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {adim.durum === "hazir" ? "✓" : index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-950">{adim.baslik}</p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-500">{adim.aciklama}</p>
                <span className="mt-3 inline-flex rounded-xl bg-white px-3 py-2 text-[11px] font-black text-gray-700 shadow-sm">
                  {adim.cta}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
