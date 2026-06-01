type LeadDurum = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";

type Lead = {
  id: string;
  baslik: string;
  durum: LeadDurum;
};

type Kod = {
  durum: string;
};

type Adim = {
  no: number;
  label: string;
  aciklama: string;
  faz: "satis" | "teslim" | "operasyon";
  href: string;
  cta: string;
  tamam: boolean;
  aktif: boolean;
  aktifLeadler?: { baslik: string }[];
  vurgu?: boolean;
};

export default function PartnerIsAkisi({
  abonelik,
  leadler,
  kodlar,
  teklifHazir,
}: {
  abonelik: { hakSayisi: number; kullanilanHak: number } | null;
  leadler: Lead[];
  kodlar: Kod[];
  teklifHazir: boolean;
}) {
  const aktifKodlar = kodlar.filter(k => k.durum !== "iptal");
  const kaporaLeadler = leadler.filter(l => ["kapora_bekliyor", "kazandi"].includes(l.durum));
  const teklifLeadler = leadler.filter(l => ["teklif_gonderildi", "kapora_bekliyor", "kazandi"].includes(l.durum));
  const gorusmeLeadler = leadler.filter(l => ["yeni", "gorusuldu"].includes(l.durum));
  const kodOlusturuldu = aktifKodlar.some(k => k.durum !== "iptal");
  const kodGonderildi = aktifKodlar.some(k => !["olusturuldu"].includes(k.durum));
  const yayinda = aktifKodlar.some(k => k.durum === "yayinda");

  // Kritik boşluk: kapora var ama kod gönderilmemiş
  const linkEksik = kaporaLeadler.length > 0 && !kodGonderildi;

  const adimlar: Adim[] = [
    {
      no: 1,
      faz: "satis",
      label: "Müşteri Bul",
      aciklama: "Görüştüğün kişiyi CRM'e ekle ve aşamayı takip et.",
      href: "#lead-crm",
      cta: "CRM'e git",
      tamam: leadler.length > 0,
      aktif: leadler.length === 0,
      aktifLeadler: gorusmeLeadler.slice(0, 3),
    },
    {
      no: 2,
      faz: "satis",
      label: "Teklif Gönder",
      aciklama: "Paket kapsamını anlat ve yazılı teklif ilet.",
      href: "#teklif",
      cta: "Teklif hazırla",
      tamam: teklifHazir || teklifLeadler.length > 0,
      aktif: leadler.length > 0 && !teklifHazir && teklifLeadler.length === 0,
      aktifLeadler: teklifLeadler.filter(l => l.durum === "teklif_gonderildi").slice(0, 3),
    },
    {
      no: 3,
      faz: "satis",
      label: "Kapora Al",
      aciklama: "Müşteri onay verdi. CRM'de durumu 'Kazandı' olarak güncelle.",
      href: "#lead-crm",
      cta: "CRM güncelle",
      tamam: kaporaLeadler.length > 0,
      aktif: teklifLeadler.length > 0 && kaporaLeadler.length === 0,
      aktifLeadler: kaporaLeadler.slice(0, 3),
    },
    {
      no: 4,
      faz: "teslim",
      label: "Aktivasyon Linki Oluştur",
      aciklama: "Teslim bölümünden tek kullanımlık link üret. Bir müşteri = bir link.",
      href: "#aktivasyon-kodlari",
      cta: "Linki Oluştur",
      tamam: kodOlusturuldu,
      aktif: kaporaLeadler.length > 0 && !kodOlusturuldu,
      vurgu: linkEksik,
    },
    {
      no: 5,
      faz: "teslim",
      label: "Müşteriye Gönder",
      aciklama: "Linki ve kurulum notunu müşteriye ilet. WhatsApp asistanı ile hızlanabilirsin.",
      href: "#aktivasyon-kodlari",
      cta: "Teslim Paketini Aç",
      tamam: kodGonderildi,
      aktif: kodOlusturuldu && !kodGonderildi,
      vurgu: kodOlusturuldu && !kodGonderildi,
    },
    {
      no: 6,
      faz: "operasyon",
      label: "Yayın & Etkinlik Kontrolü",
      aciklama: "Davetiye yayında mı? QR kartlar ve ekip erişimi hazır mı?",
      href: "#operasyon",
      cta: "Operasyona bak",
      tamam: yayinda,
      aktif: kodGonderildi && !yayinda,
    },
  ];

  const aktifAdim = adimlar.find(a => a.aktif || a.vurgu) ?? null;
  const tamamlananSayisi = adimlar.filter(a => a.tamam).length;

  if (!abonelik) return null;

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-purple-50/60 via-white to-pink-50/30 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-purple-600/70">İş Akışı</p>
            <h2 className="mt-1.5 text-xl font-black text-gray-950">
              Müşteri bulmaktan teslime: adım adım
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-purple-600 to-pink-500 transition-all"
                style={{ width: `${Math.round((tamamlananSayisi / adimlar.length) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-black text-gray-500">{tamamlananSayisi}/{adimlar.length}</span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">

        {/* Kritik uyarı: Kapora var ama link yok */}
        {linkEksik && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <span className="mt-0.5 text-lg">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-black text-amber-900">
                {kaporaLeadler.length} müşteri kapora/anlaşma aşamasında — aktivasyon linki henüz oluşturulmadı
              </p>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-amber-800">
                Teslim bölümüne giderek her müşteri için ayrı bir aktivasyon linki oluşturun ve gönderin.
              </p>
            </div>
            <a
              href="#aktivasyon-kodlari"
              className="shrink-0 rounded-xl bg-amber-500 px-3 py-2 text-xs font-black text-white hover:bg-amber-600 transition-colors"
            >
              Linki Oluştur
            </a>
          </div>
        )}

        {/* Adım pipeline */}
        <div className="grid gap-1">

          {/* Faz başlıkları (3 faz) */}
          <div className="mb-2 grid grid-cols-3 gap-3 text-center">
            {(["satis", "teslim", "operasyon"] as const).map(faz => (
              <div key={faz} className="rounded-xl bg-gray-50 py-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                  {faz === "satis" ? "Satış" : faz === "teslim" ? "Teslim" : "Operasyon"}
                </span>
              </div>
            ))}
          </div>

          {/* Adımlar — 3 sütun grid (her faz bir sütun) */}
          <div className="grid grid-cols-3 gap-3">
            {(["satis", "teslim", "operasyon"] as const).map(faz => (
              <div key={faz} className="space-y-2">
                {adimlar.filter(a => a.faz === faz).map(adim => (
                  <a
                    key={adim.no}
                    href={adim.href}
                    className={`block rounded-2xl border p-3 transition-all ${
                      adim.vurgu
                        ? "border-amber-300 bg-amber-50 hover:bg-amber-100"
                        : adim.tamam
                        ? "border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                        : adim.aktif
                        ? "border-purple-200 bg-purple-50 hover:bg-purple-100"
                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                        adim.vurgu
                          ? "bg-amber-500 text-white"
                          : adim.tamam
                          ? "bg-emerald-500 text-white"
                          : adim.aktif
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}>
                        {adim.tamam ? "✓" : adim.no}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-xs font-black leading-tight ${
                          adim.vurgu ? "text-amber-900" :
                          adim.tamam ? "text-emerald-800" :
                          adim.aktif ? "text-purple-900" :
                          "text-gray-500"
                        }`}>
                          {adim.label}
                        </p>
                        <p className={`mt-1 text-[11px] leading-relaxed ${
                          adim.vurgu ? "text-amber-700" :
                          adim.tamam ? "text-emerald-600" :
                          adim.aktif ? "text-purple-700" :
                          "text-gray-400"
                        }`}>
                          {adim.aciklama}
                        </p>

                        {/* Aktif lead'ler */}
                        {adim.aktifLeadler && adim.aktifLeadler.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {adim.aktifLeadler.map(l => (
                              <span key={l.baslik} className="block truncate rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-gray-600 shadow-sm">
                                {l.baslik}
                              </span>
                            ))}
                          </div>
                        )}

                        {(adim.aktif || adim.vurgu) && (
                          <span className={`mt-2.5 inline-block rounded-lg px-2.5 py-1 text-[10px] font-black ${
                            adim.vurgu
                              ? "bg-amber-500 text-white"
                              : "bg-purple-600 text-white"
                          }`}>
                            {adim.cta} →
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Sonraki adım özeti */}
        {aktifAdim && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <span className="text-sm">📍</span>
            <p className="text-xs font-semibold text-gray-600">
              <span className="font-black text-gray-900">Şu an: {aktifAdim.label}.</span>
              {" "}{aktifAdim.aciklama}
            </p>
            <a href={aktifAdim.href}
              className="ml-auto shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-black text-gray-700 hover:border-purple-200 hover:text-purple-700 transition-colors">
              {aktifAdim.cta} →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
