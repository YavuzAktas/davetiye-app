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
  const takipBekleyen = aktifLead.filter(lead => gunOnce(lead.updatedAt) >= 7);
  const aktifEkipLinki = ekipErisimleri.filter(erisim =>
    erisim.aktif && !erisim.revokedAt && !tarihGectiMi(erisim.expiresAt)
  ).length;

  const aksiyonlar: Aksiyon[] = [
    ...(!abonelik ? [{
      baslik: "Partner paketini seç",
      aciklama: "Müşteriye link verebilmek için aktif paket gerekir.",
      href: "#odeme",
      cta: "Paketlere git",
      onem: "kritik" as const,
    }] : []),
    ...(abonelik && kalanHak <= 2 ? [{
      baslik: "Aktivasyon hakkı azalıyor",
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
    ...(kaporaLead.length > 0 ? [{
      baslik: `${kaporaLead.length} müşteri için aktivasyon linki oluştur`,
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
            <HizliIslem href={abonelik ? "#whatsapp-asistani" : "#odeme"} label="WhatsApp mesajı hazırla" />
            <HizliIslem href={abonelik ? "#teklif" : "#odeme"} label="Teklif hazırla" />
            <HizliIslem href={abonelik ? "#ekip" : "#odeme"} label="Ekip linki oluştur" />
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
