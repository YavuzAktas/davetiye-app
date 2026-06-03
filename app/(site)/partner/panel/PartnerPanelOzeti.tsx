type Abonelik = {
  paketId: string;
  hakSayisi: number;
  kullanilanHak: number;
  bitisAt: string | null;
} | null;

type Kod = {
  id: string;
  kod: string;
  durum: string;
  createdAt: string;
  kullanilanAt: string | null;
  not: string | null;
};

type LeadDurum = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";

type Lead = {
  id: string;
  baslik: string;
  durum: LeadDurum;
  etkinlikTarihi: string | null;
  kisiSayisi: number | null;
  updatedAt: string;
};

type EkipErisim = {
  id: string;
  aktif: boolean;
  expiresAt: string | null;
  revokedAt: string | null;
};

type Marka = {
  logoUrl: string | null;
  markaSlogani: string | null;
  destekTelefonu: string | null;
  instagramUrl: string | null;
  whatsappImzasi: string | null;
};

type Aksiyon = {
  baslik: string;
  aciklama: string;
  href: string;
  cta: string;
  onem: "kritik" | "bugun" | "normal";
};

type BasariParcasi = {
  baslik: string;
  puan: number;
  max: number;
  aciklama: string;
  href: string;
};

const SICAK_LEAD_DURUMLARI = new Set<LeadDurum>(["teklif_gonderildi", "kapora_bekliyor"]);
const KAPORA_LEAD_DURUMLARI = new Set<LeadDurum>(["kapora_bekliyor", "kazandi"]);
const AKTIF_LEAD_DURUMLARI = new Set<LeadDurum>(["yeni", "gorusuldu", "teklif_gonderildi", "kapora_bekliyor"]);
const BASLAYAN_KOD_DURUMLARI = new Set(["kayit_oldu", "odeme_bekliyor", "davetiye_olusturuldu", "yayinda"]);

function tarihGectiMi(tarih: string | null) {
  return Boolean(tarih && new Date(tarih) <= new Date());
}

function gunOnce(tarih: string) {
  return Math.floor((Date.now() - new Date(tarih).getTime()) / (1000 * 60 * 60 * 24));
}

function markaTamamMi(marka: Marka) {
  return Boolean(
    marka.logoUrl ||
    marka.markaSlogani?.trim() ||
    marka.destekTelefonu?.trim() ||
    marka.instagramUrl?.trim() ||
    marka.whatsappImzasi?.trim()
  );
}

function clamp(sayi: number, min: number, max: number) {
  return Math.max(min, Math.min(max, sayi));
}

function yuzde(deger: number, toplam: number) {
  if (toplam <= 0) return 0;
  return Math.round((deger / toplam) * 100);
}

function skorRengi(skor: number) {
  if (skor >= 80) return "from-emerald-500 to-teal-500";
  if (skor >= 55) return "from-amber-500 to-orange-500";
  return "from-rose-500 to-pink-500";
}

function skorEtiketi(skor: number) {
  if (skor >= 80) return "Güçlü";
  if (skor >= 55) return "Gelişiyor";
  return "Başlangıç";
}

function aksiyonStili(onem: Aksiyon["onem"]) {
  if (onem === "kritik") return "border-red-100 bg-red-50 text-red-800";
  if (onem === "bugun") return "border-amber-100 bg-amber-50 text-amber-800";
  return "border-gray-100 bg-white text-gray-800";
}

function anaAksiyonStili(onem: Aksiyon["onem"]) {
  if (onem === "kritik") return "border-red-100 bg-linear-to-br from-red-50 via-white to-rose-50 text-red-900";
  if (onem === "bugun") return "border-amber-100 bg-linear-to-br from-amber-50 via-white to-orange-50 text-amber-900";
  return "border-purple-100 bg-linear-to-br from-purple-50 via-white to-pink-50 text-purple-950";
}

function aksiyonEtiketi(onem: Aksiyon["onem"]) {
  if (onem === "kritik") return "Acil";
  if (onem === "bugun") return "Bugün";
  return "Önerilen";
}

export default function PartnerPanelOzeti({
  abonelik,
  kodlar,
  leadler,
  ekipErisimleri,
  marka,
  teklifHazir,
}: {
  abonelik: Abonelik;
  kodlar: Kod[];
  leadler: Lead[];
  ekipErisimleri: EkipErisim[];
  marka: Marka;
  teklifHazir: boolean;
}) {
  const aktifKodlar = kodlar.filter(kod => kod.durum !== "iptal");
  const kalanHak = abonelik ? Math.max(0, abonelik.hakSayisi - abonelik.kullanilanHak) : 0;
  const gonderilmeyenKod = aktifKodlar.filter(kod => kod.durum === "olusturuldu").length;
  const teslimEdildiBaslamadi = aktifKodlar.filter(kod => kod.durum === "gonderildi").length;
  const yayinda = aktifKodlar.filter(kod => kod.durum === "yayinda").length;
  const aktifLead = leadler.filter(lead => AKTIF_LEAD_DURUMLARI.has(lead.durum));
  const sicakLead = leadler.filter(lead => SICAK_LEAD_DURUMLARI.has(lead.durum));
  const kaporaLead = leadler.filter(lead => KAPORA_LEAD_DURUMLARI.has(lead.durum));
  // Aktivasyon kodu oluşturulmamış kapora/kazandı lead sayısı:
  // Lead-kod arasında doğrudan bağlantı olmadığından toplam aktif kod sayısını çıkarırız.
  const kodSizKaporaLead = Math.max(0, kaporaLead.length - aktifKodlar.length);
  const takipBekleyen = aktifLead.filter(lead => gunOnce(lead.updatedAt) >= 7);
  const aktifEkipLinki = ekipErisimleri.filter(erisim =>
    erisim.aktif && !erisim.revokedAt && !tarihGectiMi(erisim.expiresAt)
  ).length;
  const baslayanKod = aktifKodlar.filter(kod => BASLAYAN_KOD_DURUMLARI.has(kod.durum)).length;
  const teslimOrani = yuzde(baslayanKod, aktifKodlar.length);
  const yayinaCikisOrani = yuzde(yayinda, aktifKodlar.length);
  const kayipLead = leadler.filter(lead => lead.durum === "kaybedildi").length;
  const kazanimOrani = yuzde(leadler.filter(lead => lead.durum === "kazandi").length, Math.max(1, leadler.length - kayipLead));
  const takipSagligi = aktifLead.length > 0 ? Math.max(0, 100 - yuzde(takipBekleyen.length, aktifLead.length)) : 100;

  const basariParcalari: BasariParcasi[] = [
    {
      baslik: "Marka hazır",
      puan: markaTamamMi(marka) ? 15 : 0,
      max: 15,
      aciklama: markaTamamMi(marka) ? "Partner markası teklif ve teslim akışında güven veriyor." : "Logo, slogan veya destek bilgisi ekleyin.",
      href: "#marka",
    },
    {
      baslik: "Satış akışı",
      puan: clamp((leadler.length > 0 ? 8 : 0) + (teklifHazir ? 7 : 0) + (sicakLead.length > 0 ? 5 : 0), 0, 20),
      max: 20,
      aciklama: leadler.length > 0 ? `${leadler.length} lead, ${sicakLead.length} sıcak fırsat takipte.` : "İlk müşteri adayını ekleyin.",
      href: "#lead-crm",
    },
    {
      baslik: "Takip disiplini",
      puan: clamp(Math.round((takipSagligi / 100) * 15), 0, 15),
      max: 15,
      aciklama: takipBekleyen.length > 0 ? `${takipBekleyen.length} lead 7 gündür güncellenmedi.` : "Geciken takip görünmüyor.",
      href: "#lead-crm",
    },
    {
      baslik: "Teslim başarısı",
      puan: clamp(Math.round((teslimOrani / 100) * 15) + (yayinaCikisOrani > 0 ? 5 : 0), 0, 20),
      max: 20,
      aciklama: aktifKodlar.length > 0 ? `Teslim başlama oranı %${teslimOrani}, yayına çıkış %${yayinaCikisOrani}.` : "İlk teslim linkini oluşturun.",
      href: "#aktivasyon-kodlari",
    },
    {
      baslik: "Ekip düzeni",
      puan: aktifEkipLinki > 0 ? 10 : 0,
      max: 10,
      aciklama: aktifEkipLinki > 0 ? `${aktifEkipLinki} sınırlı ekip linki aktif.` : "Operasyon veya teslim için sınırlı ekip linki oluşturun.",
      href: "#ekip",
    },
    {
      baslik: "Kapasite kullanımı",
      puan: abonelik ? clamp(Math.round((abonelik.kullanilanHak / Math.max(1, abonelik.hakSayisi)) * 15) + (kazanimOrani > 0 ? 5 : 0), 0, 20) : 0,
      max: 20,
      aciklama: abonelik ? `${abonelik.kullanilanHak}/${abonelik.hakSayisi} hak kullanıldı. Kazanım oranı %${kazanimOrani}.` : "Aktif abonelik yok.",
      href: "#odeme",
    },
  ];
  const basariSkoru = clamp(basariParcalari.reduce((toplam, parca) => toplam + parca.puan, 0), 0, 100);
  const eksikParcalar = basariParcalari
    .filter(parca => parca.puan < parca.max)
    .sort((a, b) => (b.max - b.puan) - (a.max - a.puan))
    .slice(0, 3);

  const aksiyonlar: Aksiyon[] = [
    ...(!abonelik ? [{
      baslik: "Partner paketini seç",
      aciklama: "Müşteriye link verebilmek için aktif paket gerekir.",
      href: "#odeme",
      cta: "Paketlere git",
      onem: "kritik" as const,
    }] : []),
    ...(abonelik && kalanHak <= 2 ? [{
      baslik: "Dijital paket hakkı azalıyor",
      aciklama: `${kalanHak} hakkınız kaldı. Yeni satış için paketi yenileyin.`,
      href: "#odeme",
      cta: "Ödeme alanı",
      onem: "bugun" as const,
    }] : []),
    ...(!markaTamamMi(marka) ? [{
      baslik: "Marka bilgisini tamamla",
      aciklama: "Logo, slogan veya destek bilgisi güven verir.",
      href: "#marka",
      cta: "Markayı düzenle",
      onem: "normal" as const,
    }] : []),
    ...(leadler.length === 0 ? [{
      baslik: "İlk müşteri adayını ekle",
      aciklama: "Görüşmeleri ve teklifleri buradan takip edin.",
      href: "#lead-crm",
      cta: "Müşteri ekle",
      onem: "normal" as const,
    }] : []),
    ...(!teklifHazir && abonelik ? [{
      baslik: "Teklif metnini hazırla",
      aciklama: "Paket kapsamını tek metinle anlatın.",
      href: "#teklif",
      cta: "Teklife git",
      onem: "normal" as const,
    }] : []),
    ...(kodSizKaporaLead > 0 ? [{
      baslik: `${kodSizKaporaLead} müşteri için teslim linki oluştur`,
      aciklama: "Kapora/anlaşma sağlandı. Şimdi teslim linkini üretin ve müşteriye gönderin.",
      href: "#aktivasyon-kodlari",
      cta: "Teslim Linkini Oluştur",
      onem: "bugun" as const,
    }] : []),
    ...(sicakLead.filter(l => !KAPORA_LEAD_DURUMLARI.has(l.durum)).length > 0 ? [{
      baslik: "Teklif aşamasını takip et",
      aciklama: `${sicakLead.filter(l => !KAPORA_LEAD_DURUMLARI.has(l.durum)).length} müşteri teklif sürecinde.`,
      href: "#lead-crm",
      cta: "CRM'e bak",
      onem: "normal" as const,
    }] : []),
    ...(gonderilmeyenKod > 0 ? [{
      baslik: "Teslim linklerini gönder",
      aciklama: `${gonderilmeyenKod} link hazır, müşteri bekliyor.`,
      href: "#aktivasyon-kodlari",
      cta: "Linkleri aç",
      onem: "bugun" as const,
    }] : []),
    ...(teslimEdildiBaslamadi > 0 ? [{
      baslik: "Müşteriye hatırlatma yap",
      aciklama: `${teslimEdildiBaslamadi} müşteri link aldı, başlamadı.`,
      href: "#whatsapp-asistani",
      cta: "Mesaj hazırla",
      onem: "bugun" as const,
    }] : []),
    ...(takipBekleyen.length > 0 ? [{
      baslik: "Takip bekleyenleri güncelle",
      aciklama: `${takipBekleyen.length} müşteri 7 gündür güncellenmedi.`,
      href: "#lead-crm",
      cta: "Müşterilere git",
      onem: "normal" as const,
    }] : []),
  ].slice(0, 5);

  const gosterilecekAksiyonlar = aksiyonlar.length > 0 ? aksiyonlar : [{
    baslik: "Panel düzenli görünüyor",
    aciklama: "Acil iş yok. Satış ve teslim durumlarını kontrol edebilirsiniz.",
    href: "#analitik",
    cta: "Raporlara bak",
    onem: "normal" as const,
  }];
  const anaAksiyon = gosterilecekAksiyonlar[0];
  const digerAksiyonlar = gosterilecekAksiyonlar.slice(1);

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-purple-50/80 via-white to-pink-50/30 px-5 py-6 sm:px-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-purple-600/70">
              Özet
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-900 sm:text-2xl">
              Bugün ne yapılacak?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Satış, teslim ve ekip işleri için en önemli uyarılar burada.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:w-[420px] sm:grid-cols-4">
            <OzetKarti baslik="Kalan hak" deger={kalanHak.toString()} vurgu={kalanHak <= 2} />
            <OzetKarti baslik="Aktif müşteri" deger={aktifLead.length.toString()} />
            <OzetKarti baslik="Sıcak fırsat" deger={sicakLead.length.toString()} vurgu={sicakLead.length > 0} />
            <OzetKarti baslik="Yayında" deger={yayinda.toString()} basari={yayinda > 0} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.15fr_0.85fr] sm:p-7">
        <div>
          <div className="mb-5 overflow-hidden rounded-3xl border border-gray-100 bg-gray-950 text-white shadow-sm">
            <div className="grid gap-5 p-5 lg:grid-cols-[220px_1fr]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Partner başarı skoru</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-5xl font-black tabular-nums">{basariSkoru}</span>
                  <span className="mb-1 text-sm font-black text-white/40">/100</span>
                </div>
                <div className={`mt-4 h-2 overflow-hidden rounded-full bg-white/10`}>
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${skorRengi(basariSkoru)}`}
                    style={{ width: `${basariSkoru}%` }}
                  />
                </div>
                <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
                  {skorEtiketi(basariSkoru)}
                </p>
              </div>

              <div>
                <p className="text-sm font-black text-white">Skoru yükselten başlıklar</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {basariParcalari.map(parca => (
                    <a
                      key={parca.baslik}
                      href={parca.href}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-black text-white">{parca.baslik}</p>
                        <span className="shrink-0 text-xs font-black tabular-nums text-white/60">
                          {parca.puan}/{parca.max}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] font-semibold leading-relaxed text-white/50">{parca.aciklama}</p>
                    </a>
                  ))}
                </div>
                {eksikParcalar.length > 0 && (
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-white/50">
                    En hızlı iyileştirme: {eksikParcalar.map(parca => parca.baslik).join(", ")}.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black text-gray-950">Öncelikli aksiyon</h3>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-gray-500 shadow-sm">
              {gosterilecekAksiyonlar.length} iş
            </span>
          </div>

          <a
            href={anaAksiyon.href}
            className={`mt-3 block rounded-3xl border px-5 py-5 shadow-sm transition-transform hover:-translate-y-0.5 ${anaAksiyonStili(anaAksiyon.onem)}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="rounded-full border border-white/50 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-700 shadow-sm">
                  {aksiyonEtiketi(anaAksiyon.onem)}
                </span>
                <p className="mt-3 text-lg font-black">{anaAksiyon.baslik}</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed opacity-75">{anaAksiyon.aciklama}</p>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-black text-white shadow-sm shadow-purple-200">
                {anaAksiyon.cta}
              </span>
            </div>
          </a>

          {digerAksiyonlar.length > 0 && (
            <div className="mt-3 space-y-2">
              {digerAksiyonlar.map(aksiyon => (
                <a
                  key={aksiyon.baslik}
                  href={aksiyon.href}
                  className={`block rounded-2xl border px-4 py-3 transition-colors hover:border-purple-100 hover:bg-purple-50 ${aksiyonStili(aksiyon.onem)} ${
                    aksiyon.onem === "kritik" ? "border-l-4 border-l-red-400" :
                    aksiyon.onem === "bugun" ? "border-l-4 border-l-amber-400" : ""
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black">{aksiyon.baslik}</p>
                      <p className="mt-1 text-xs font-semibold leading-relaxed opacity-65">{aksiyon.aciklama}</p>
                    </div>
                    <span className="w-fit shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 shadow-sm">
                      {aksiyon.cta}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-purple-100/60 bg-linear-to-b from-purple-50/40 to-pink-50/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black text-gray-900">Hızlı işlemler</h3>
            <span className="rounded-full bg-white border border-gray-100 px-3 py-1 text-[11px] font-bold text-gray-400">Kısayol</span>
          </div>
          <div className="mt-3 grid gap-2">
            <HizliIslem href={abonelik ? "#lead-crm" : "#odeme"} label="Müşteri adayı ekle" variant="primary" />
            <HizliIslem href={abonelik ? "#aktivasyon-kodlari" : "#odeme"} label="Teslim linki oluştur" />
            <HizliIslem href={abonelik ? "#satis-detayli-araclar" : "#odeme"} label="Detaylı satış araçları" />
            <HizliIslem href={abonelik ? "#operasyon-detaylari-grubu" : "#odeme"} label="Etkinlik günü araçları" />
          </div>

          <div className="mt-4 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Ekip erişimi</p>
            <p className="mt-1 text-2xl font-black tabular-nums text-gray-900">{aktifEkipLinki}</p>
            <p className="mt-1 text-xs font-semibold text-gray-500">aktif sınırlı link</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function OzetKarti({ baslik, deger, vurgu, basari }: { baslik: string; deger: string; vurgu?: boolean; basari?: boolean }) {
  return (
    <div className={`rounded-2xl border px-3 py-2.5 ${
      vurgu ? "border-purple-200 bg-purple-50" :
      basari ? "border-emerald-100 bg-emerald-50" :
      "border-gray-100 bg-white shadow-sm"
    }`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.12em] ${
        vurgu ? "text-purple-500" : basari ? "text-emerald-500" : "text-gray-400"
      }`}>{baslik}</p>
      <p className={`mt-1 text-xl font-black tabular-nums ${
        vurgu ? "text-purple-700" : basari ? "text-emerald-700" : "text-gray-900"
      }`}>{deger}</p>
    </div>
  );
}

function HizliIslem({
  href,
  label,
  variant = "secondary",
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const className = variant === "primary"
    ? "flex items-center justify-between gap-3 rounded-2xl border border-transparent bg-linear-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-black text-white shadow-sm shadow-purple-200 transition-opacity hover:opacity-90"
    : "flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-black text-gray-700 shadow-sm transition-colors hover:border-purple-100 hover:bg-purple-50 hover:text-purple-700";

  return (
    <a href={href} className={className}>
      {label}
      <span className={variant === "primary" ? "text-white/70" : "text-gray-300"}>→</span>
    </a>
  );
}
