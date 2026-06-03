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
  sonuc: string;
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

  const linkEksik = kaporaLeadler.length > 0 && !kodGonderildi;

  const adimlar: Adim[] = [
    {
      no: 1,
      faz: "satis",
      label: "Müşteriyi ekle",
      aciklama: "Salon, davet evi veya organizasyon müşterisini CRM'e ekleyin.",
      sonuc: "Görüşme dağılmaz; teklif ve teslim tek yerden izlenir.",
      href: "#lead-crm",
      cta: "Müşteri ekle",
      tamam: leadler.length > 0,
      aktif: leadler.length === 0,
      aktifLeadler: gorusmeLeadler.slice(0, 3),
    },
    {
      no: 2,
      faz: "satis",
      label: "Paketi seç",
      aciklama: "Hızlı davetiye, salon operasyonu, anı paketi veya premium deneyimi seçin.",
      sonuc: "Müşteri ne aldığını net görür; siz ek hizmeti daha kolay satarsınız.",
      href: "#paketler",
      cta: "Paketlere git",
      tamam: teklifHazir || teklifLeadler.length > 0,
      aktif: leadler.length > 0 && !teklifHazir && teklifLeadler.length === 0,
      aktifLeadler: teklifLeadler.filter(l => l.durum === "teklif_gonderildi").slice(0, 3),
    },
    {
      no: 3,
      faz: "satis",
      label: "Fiyat ve teklifi gönder",
      aciklama: "Kârlılığı kontrol edip WhatsApp veya teklif metniyle müşteriye iletin.",
      sonuc: "Salon hizmetinin üstüne satılabilir dijital paket oluşur.",
      href: "#teklif",
      cta: "Teklif hazırla",
      tamam: kaporaLeadler.length > 0,
      aktif: teklifLeadler.length > 0 && kaporaLeadler.length === 0,
      aktifLeadler: kaporaLeadler.slice(0, 3),
    },
    {
      no: 4,
      faz: "teslim",
      label: "Aktivasyon linki ver",
      aciklama: "Anlaşılan müşteri için tek kullanımlık teslim linki üretin.",
      sonuc: "Müşteri kendi davetiyesini ve içeriklerini kendi hesabında yönetir.",
      href: "#aktivasyon-kodlari",
      cta: "Link oluştur",
      tamam: kodOlusturuldu,
      aktif: kaporaLeadler.length > 0 && !kodOlusturuldu,
      vurgu: linkEksik,
    },
    {
      no: 5,
      faz: "teslim",
      label: "Etkinlik kitini hazırla",
      aciklama: "QR kart, canlı duvar ve ekip görevlerini etkinlikten önce kontrol edin.",
      sonuc: "Etkinlik günü kapı, masa ve anı toplama akışı daha düzenli ilerler.",
      href: "#etkinlik-gunu-kiti",
      cta: "Kiti aç",
      tamam: kodGonderildi,
      aktif: kodOlusturuldu && !kodGonderildi,
      vurgu: kodOlusturuldu && !kodGonderildi,
    },
    {
      no: 6,
      faz: "operasyon",
      label: "Teslimi raporla",
      aciklama: "Yayına çıkan davetiye, RSVP ve kullanım özetini müşteriye aktarın.",
      sonuc: "Müşteri hizmetin değerini görür; tekrar satış ve referans ihtimali artar.",
      href: "#teslim-raporu",
      cta: "Raporla",
      tamam: yayinda,
      aktif: kodGonderildi && !yayinda,
    },
  ];

  const aktifAdim = adimlar.find(a => a.aktif || a.vurgu) ?? null;
  const tamamlananSayisi = adimlar.filter(a => a.tamam).length;

  if (!abonelik) return null;

  return (
    <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
      <div className="border-b border-purple-100 bg-linear-to-br from-gray-950 via-purple-950 to-gray-900 px-5 py-6 text-white sm:px-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-purple-200/70">Ana satış akışı</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Yeni müşteriye dijital paket sat
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-white/60">
              Davet evi veya salon müşterisine davetiye, LCV, QR giriş ve anı toplama paketini satmak için tek sıra. Önce müşteriyi ekleyin, sonra paketi teklif edip teslim linkini üretin.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:w-80">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-white/60">Akış ilerlemesi</p>
              <span className="text-sm font-black tabular-nums text-white">{tamamlananSayisi}/{adimlar.length}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-purple-400 transition-all"
                style={{ width: `${Math.round((tamamlananSayisi / adimlar.length) * 100)}%` }}
              />
            </div>
            <a
              href={aktifAdim?.href ?? "#lead-crm"}
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-purple-50"
            >
              {aktifAdim ? aktifAdim.cta : "İlk müşteriyi ekle"}
            </a>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="mb-5 grid gap-3 lg:grid-cols-3">
          {[
            ["Ek gelir", "Dijital davetiye ve QR hizmetini salon paketine ekleyin."],
            ["Kolay teslim", "Müşteri kendi hesabında yönetir; partner operasyonu izler."],
            ["Daha modern hizmet", "LCV, QR check-in, canlı duvar ve anı akışı tek pakette görünür."],
          ].map(([baslik, aciklama]) => (
            <div key={baslik} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-sm font-black text-gray-950">{baslik}</p>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-500">{aciklama}</p>
            </div>
          ))}
        </div>

        {linkEksik && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
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

        <div className="grid gap-4 lg:grid-cols-3">
            {(["satis", "teslim", "operasyon"] as const).map(faz => (
              <div key={faz} className="rounded-3xl border border-gray-100 bg-gray-50 p-3">
                <div className="mb-3 rounded-2xl bg-white px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                    {faz === "satis" ? "Satış" : faz === "teslim" ? "Teslim" : "Operasyon"}
                  </p>
                  <p className="mt-1 text-sm font-black text-gray-950">
                    {faz === "satis" ? "Müşteriyi kazan" : faz === "teslim" ? "Link ve kit ver" : "Günü yönet"}
                  </p>
                </div>
                <div className="space-y-2">
                {adimlar.filter(a => a.faz === faz).map(adim => (
                  <a
                    key={adim.no}
                    href={adim.href}
                    className={`block rounded-2xl border p-4 transition-all ${
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
                        <p className={`text-sm font-black leading-tight ${
                          adim.vurgu ? "text-amber-900" :
                          adim.tamam ? "text-emerald-800" :
                          adim.aktif ? "text-purple-900" :
                          "text-gray-700"
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
                        <p className="mt-2 rounded-xl bg-white px-3 py-2 text-[11px] font-semibold leading-relaxed text-gray-500">
                          {adim.sonuc}
                        </p>

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
              </div>
            ))}
        </div>

        {aktifAdim && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
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
