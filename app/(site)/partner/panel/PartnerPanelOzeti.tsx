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
  return "border-purple-100 bg-purple-50 text-purple-800";
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
  const takipBekleyen = aktifLead.filter(lead => gunOnce(lead.updatedAt) >= 7);
  const aktifEkipLinki = ekipErisimleri.filter(erisim =>
    erisim.aktif && !erisim.revokedAt && !tarihGectiMi(erisim.expiresAt)
  ).length;

  const aksiyonlar: Aksiyon[] = [
    ...(!abonelik ? [{
      baslik: "Partner paketini seç",
      aciklama: "Müşteriye teslim linki oluşturmak için aktif paket gerekir.",
      href: "#odeme",
      cta: "Paketlere git",
      onem: "kritik" as const,
    }] : []),
    ...(abonelik && kalanHak <= 2 ? [{
      baslik: "Aktivasyon hakkı azalıyor",
      aciklama: `${kalanHak} hakkınız kaldı. Satış akışı kesilmeden yenilemeyi planlayın.`,
      href: "#odeme",
      cta: "Ödeme alanı",
      onem: "bugun" as const,
    }] : []),
    ...(!markaTamamMi(marka) ? [{
      baslik: "Marka bilgisini tamamla",
      aciklama: "Logo, slogan veya destek bilgisi müşteri teslim ekranını daha güvenilir gösterir.",
      href: "#marka",
      cta: "Markayı düzenle",
      onem: "normal" as const,
    }] : []),
    ...(leadler.length === 0 ? [{
      baslik: "İlk müşteri adayını ekle",
      aciklama: "Satış takibi ve segmentler lead kayıtlarıyla anlamlı hale gelir.",
      href: "#lead-crm",
      cta: "Müşteri ekle",
      onem: "normal" as const,
    }] : []),
    ...(!teklifHazir && abonelik ? [{
      baslik: "Teklif metnini hazırla",
      aciklama: "Paket kapsamını tek metin/PDF olarak anlatmak satış görüşmesini hızlandırır.",
      href: "#teklif",
      cta: "Teklife git",
      onem: "normal" as const,
    }] : []),
    ...(sicakLead.length > 0 ? [{
      baslik: "Sıcak fırsatları kapat",
      aciklama: `${sicakLead.length} müşteri teklif veya kapora aşamasında.`,
      href: "#segmentler",
      cta: "Segmentlere bak",
      onem: "bugun" as const,
    }] : []),
    ...(gonderilmeyenKod > 0 ? [{
      baslik: "Teslim linklerini gönder",
      aciklama: `${gonderilmeyenKod} aktivasyon linki oluşturulmuş ama müşteriye gönderilmemiş.`,
      href: "#aktivasyon-kodlari",
      cta: "Linkleri aç",
      onem: "bugun" as const,
    }] : []),
    ...(teslimEdildiBaslamadi > 0 ? [{
      baslik: "Müşteriye hatırlatma yap",
      aciklama: `${teslimEdildiBaslamadi} müşteri linki almış ama kuruluma başlamamış.`,
      href: "#whatsapp-asistani",
      cta: "Mesaj hazırla",
      onem: "bugun" as const,
    }] : []),
    ...(takipBekleyen.length > 0 ? [{
      baslik: "Takip bekleyenleri güncelle",
      aciklama: `${takipBekleyen.length} aktif müşteri adayı 7 gündür güncellenmedi.`,
      href: "#lead-crm",
      cta: "Müşterilere git",
      onem: "normal" as const,
    }] : []),
  ].slice(0, 5);

  const gosterilecekAksiyonlar = aksiyonlar.length > 0 ? aksiyonlar : [{
    baslik: "Panel düzenli görünüyor",
    aciklama: "Bugün acil iş yok. Satış raporlarını ve teslim durumlarını kontrol edebilirsiniz.",
    href: "#analitik",
    cta: "Raporlara bak",
    onem: "normal" as const,
  }];

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-gray-950 via-purple-950 to-gray-900 px-5 py-6 text-white sm:px-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-200/80">
              Özet
            </p>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">
              Bugün ne yapılacak?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              En önemli satış, teslim ve operasyon işlerini tek yerde toplayarak paneli daha hızlı kullanmanızı sağlar.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:w-[420px] sm:grid-cols-4">
            <OzetKarti baslik="Kalan hak" deger={kalanHak.toString()} />
            <OzetKarti baslik="Aktif müşteri" deger={aktifLead.length.toString()} />
            <OzetKarti baslik="Sıcak fırsat" deger={sicakLead.length.toString()} />
            <OzetKarti baslik="Yayında" deger={yayinda.toString()} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.15fr_0.85fr] sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black text-gray-950">Sıradaki işler</h3>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">
              {gosterilecekAksiyonlar.length} iş
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {gosterilecekAksiyonlar.map(aksiyon => (
              <a
                key={aksiyon.baslik}
                href={aksiyon.href}
                className={`block rounded-2xl border px-4 py-4 transition-transform hover:-translate-y-0.5 ${aksiyonStili(aksiyon.onem)}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black">{aksiyon.baslik}</p>
                    <p className="mt-1 text-xs font-semibold leading-relaxed opacity-75">{aksiyon.aciklama}</p>
                  </div>
                  <span className="w-fit rounded-xl bg-white/80 px-3 py-2 text-xs font-black text-gray-900 shadow-sm">
                    {aksiyon.cta}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-black text-gray-950">Hızlı işlemler</h3>
          <div className="mt-3 grid gap-2">
            <HizliIslem href={abonelik ? "#lead-crm" : "#odeme"} label="Müşteri adayı ekle" />
            <HizliIslem href={abonelik ? "#aktivasyon-kodlari" : "#odeme"} label="Teslim linki oluştur" />
            <HizliIslem href={abonelik ? "#whatsapp-asistani" : "#odeme"} label="WhatsApp mesajı hazırla" />
            <HizliIslem href={abonelik ? "#teklif" : "#odeme"} label="Teklif hazırla" />
            <HizliIslem href={abonelik ? "#ekip" : "#odeme"} label="Ekip linki oluştur" />
          </div>

          <div className="mt-4 rounded-2xl border border-white bg-white px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400">Ekip erişimi</p>
            <p className="mt-1 text-2xl font-black tabular-nums text-gray-950">{aktifEkipLinki}</p>
            <p className="mt-1 text-xs font-semibold text-gray-500">aktif sınırlı link</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function OzetKarti({ baslik, deger }: { baslik: string; deger: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">{baslik}</p>
      <p className="mt-1 text-xl font-black tabular-nums text-white">{deger}</p>
    </div>
  );
}

function HizliIslem({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-black text-gray-800 shadow-sm transition-colors hover:border-purple-100 hover:bg-purple-50 hover:text-purple-800"
    >
      {label}
      <span className="text-gray-300">→</span>
    </a>
  );
}
