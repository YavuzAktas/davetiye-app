"use client";

import { useMemo, useState } from "react";

type LeadDurum = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";

type Lead = {
  id: string;
  baslik: string;
  etkinlikTuru: string | null;
  etkinlikTarihi: string | null;
  kisiSayisi: number | null;
  kaynak: string | null;
  durum: LeadDurum;
  createdAt: string;
  updatedAt: string;
};

type Segment = {
  id: string;
  baslik: string;
  aciklama: string;
  aksiyon: string;
  paket: string;
  renk: string;
  leadler: Lead[];
};

const KAPALI_DURUMLAR = new Set<LeadDurum>(["kazandi", "kaybedildi"]);
const SICAK_DURUMLAR = new Set<LeadDurum>(["teklif_gonderildi", "kapora_bekliyor"]);

const DURUM_LABEL: Record<LeadDurum, string> = {
  yeni: "Yeni",
  gorusuldu: "Görüşüldü",
  teklif_gonderildi: "Teklif",
  kapora_bekliyor: "Kapora",
  kazandi: "Kazandı",
  kaybedildi: "Kaybedildi",
};

function tarihKisa(tarih: string | null) {
  if (!tarih) return "Tarih yok";
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function gunFarki(tarih: string | null) {
  if (!tarih) return null;
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const hedef = new Date(tarih);
  hedef.setHours(0, 0, 0, 0);
  return Math.round((hedef.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));
}

function gunOnce(tarih: string) {
  const bugun = new Date();
  return Math.floor((bugun.getTime() - new Date(tarih).getTime()) / (1000 * 60 * 60 * 24));
}

function metinIcinde(lead: Lead, arananlar: string[]) {
  const metin = `${lead.baslik} ${lead.etkinlikTuru ?? ""} ${lead.kaynak ?? ""}`.toLocaleLowerCase("tr-TR");
  return arananlar.some(aranan => metin.includes(aranan));
}

function segmentMesaji(segment: Segment) {
  const satirlar = [
    `${segment.baslik} segmenti`,
    "",
    segment.aciklama,
    "",
    `Önerilen paket/konumlandırma: ${segment.paket}`,
    `Önerilen aksiyon: ${segment.aksiyon}`,
    "",
    "Öncelikli kayıtlar:",
    ...segment.leadler.slice(0, 8).map(lead => {
      const detay = [
        lead.etkinlikTuru,
        lead.kisiSayisi ? `${lead.kisiSayisi} kişi` : null,
        lead.etkinlikTarihi ? tarihKisa(lead.etkinlikTarihi) : null,
        DURUM_LABEL[lead.durum],
      ].filter(Boolean).join(" · ");
      return `- ${lead.baslik}${detay ? ` (${detay})` : ""}`;
    }),
    "",
    "Not: Bu liste kişisel iletişim bilgisi içermez; yalnızca satış takibi için özetlenmiştir.",
  ];

  return satirlar.join("\n");
}

function leadSirala(leadler: Lead[]) {
  return [...leadler].sort((a, b) => {
    const aSicak = SICAK_DURUMLAR.has(a.durum) ? 0 : 1;
    const bSicak = SICAK_DURUMLAR.has(b.durum) ? 0 : 1;
    if (aSicak !== bSicak) return aSicak - bSicak;

    const aTarih = a.etkinlikTarihi ? new Date(a.etkinlikTarihi).getTime() : Number.MAX_SAFE_INTEGER;
    const bTarih = b.etkinlikTarihi ? new Date(b.etkinlikTarihi).getTime() : Number.MAX_SAFE_INTEGER;
    return aTarih - bTarih;
  });
}

export default function PartnerMusteriSegmentleri({ leadler }: { leadler: Lead[] }) {
  const [aktifSegmentId, setAktifSegmentId] = useState("sicak-firsatlar");
  const [kopyalandi, setKopyalandi] = useState(false);

  const segmentler = useMemo<Segment[]>(() => {
    const aktifLeadler = leadler.filter(lead => !KAPALI_DURUMLAR.has(lead.durum));
    const yakinTarih = aktifLeadler.filter(lead => {
      const fark = gunFarki(lead.etkinlikTarihi);
      return fark !== null && fark >= 0 && fark <= 45;
    });
    const takipBekleyen = aktifLeadler.filter(lead => gunOnce(lead.updatedAt) >= 7);
    const sicakFirsatlar = aktifLeadler.filter(lead => SICAK_DURUMLAR.has(lead.durum));
    const buyukEtkinlikler = aktifLeadler.filter(lead => (lead.kisiSayisi ?? 0) >= 250);
    const dugunNisan = aktifLeadler.filter(lead =>
      metinIcinde(lead, ["düğün", "dugun", "nişan", "nisan", "kına", "kina"])
    );
    const kurumsal = aktifLeadler.filter(lead =>
      metinIcinde(lead, ["kurumsal", "lansman", "şirket", "sirket", "açılış", "acilis", "mezuniyet"])
    );

    return [
      {
        id: "sicak-firsatlar",
        baslik: "Sıcak fırsatlar",
        aciklama: "Teklif veya kapora aşamasına gelmiş, kapanışa en yakın müşteri adayları.",
        aksiyon: "Aynı gün kısa takip mesajı gönderin ve net teslim kapsamı sunun.",
        paket: "Premium veya Kurumsal paket; QR check-in ve teslim raporu vurgusu.",
        renk: "border-emerald-100 bg-emerald-50 text-emerald-800",
        leadler: leadSirala(sicakFirsatlar),
      },
      {
        id: "yakin-tarih",
        baslik: "Yakın tarihli etkinlikler",
        aciklama: "45 gün içinde gerçekleşecek etkinlikler; karar döngüsü daha hızlıdır.",
        aksiyon: "Hazır satış paketi ve WhatsApp şablonuyla hızlı kapanış teklif edin.",
        paket: "Hızlı teslim paketi; davetiye linki, RSVP ve QR kit odaklı.",
        renk: "border-amber-100 bg-amber-50 text-amber-800",
        leadler: leadSirala(yakinTarih),
      },
      {
        id: "buyuk-etkinlik",
        baslik: "Büyük etkinlikler",
        aciklama: "250 kişi ve üzeri etkinlikler; operasyon değeri daha yüksek olur.",
        aksiyon: "QR check-in, oturma planı ve personel ekranını ana değer olarak anlatın.",
        paket: "Kurumsal operasyon paketi; check-in, masa planı ve canlı duvar.",
        renk: "border-purple-100 bg-purple-50 text-purple-800",
        leadler: leadSirala(buyukEtkinlikler),
      },
      {
        id: "dugun-nisan",
        baslik: "Düğün / nişan odaklı",
        aciklama: "Düğün, nişan ve kına işleri; görsel deneyim ve anı toplama daha etkili satar.",
        aksiyon: "Canlı duvar, fotoğraf albümü ve anı kitabı çıktılarını öne çıkarın.",
        paket: "Deneyim paketi; lüks şablon, canlı duvar ve anı arşivi.",
        renk: "border-pink-100 bg-pink-50 text-pink-800",
        leadler: leadSirala(dugunNisan),
      },
      {
        id: "kurumsal",
        baslik: "Kurumsal / davet evi işleri",
        aciklama: "Lansman, şirket, mezuniyet veya davet evi kaynaklı işler; süreç ve raporlama önemlidir.",
        aksiyon: "Teslim raporu, RSVP takibi ve operasyon panosunu vurgulayın.",
        paket: "Kurumsal raporlama paketi; teslim raporu ve ekip kullanımı.",
        renk: "border-sky-100 bg-sky-50 text-sky-800",
        leadler: leadSirala(kurumsal),
      },
      {
        id: "takip-bekleyen",
        baslik: "Takip bekleyenler",
        aciklama: "Son 7 gündür güncellenmemiş aktif fırsatlar; satış kaçağı riski taşır.",
        aksiyon: "Tek cümlelik durum hatırlatması gönderin veya CRM durumunu kapatın.",
        paket: "Mevcut ihtiyaca göre en kısa teklif; karar vermeyi kolaylaştıran net kapsam.",
        renk: "border-red-100 bg-red-50 text-red-800",
        leadler: leadSirala(takipBekleyen),
      },
    ];
  }, [leadler]);

  const aktifSegment = segmentler.find(segment => segment.id === aktifSegmentId) ?? segmentler[0];
  const toplamAktif = leadler.filter(lead => !KAPALI_DURUMLAR.has(lead.durum)).length;
  const segmentKapsami = toplamAktif > 0 ? Math.round((aktifSegment.leadler.length / toplamAktif) * 100) : 0;

  const kopyala = async () => {
    await navigator.clipboard.writeText(segmentMesaji(aktifSegment));
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 1800);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-white via-purple-50 to-rose-50 px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">
              Müşteri Segmentleri
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Aynı müşteriye aynı satış diliyle gitmeyin
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Lead kayıtlarını satış niyetine göre gruplar. Telefon, e-posta veya hassas bilgi göstermeden hangi fırsata nasıl yaklaşılacağını önerir.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:w-80">
            <OzetKart baslik="Aktif" deger={toplamAktif.toString()} />
            <OzetKart baslik="Segment" deger={aktifSegment.leadler.length.toString()} />
            <OzetKart baslik="Kapsam" deger={`%${segmentKapsami}`} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr] sm:p-7">
        <div className="space-y-3">
          {segmentler.map(segment => {
            const aktif = segment.id === aktifSegment.id;
            return (
              <button
                key={segment.id}
                type="button"
                onClick={() => setAktifSegmentId(segment.id)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                  aktif
                    ? `${segment.renk} shadow-sm`
                    : "border-gray-100 bg-gray-50 text-gray-700 hover:border-purple-100 hover:bg-purple-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-black">{segment.baslik}</p>
                    <p className="mt-1 text-xs font-semibold leading-relaxed opacity-75">{segment.aciklama}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-black tabular-nums">
                    {segment.leadler.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className={`rounded-3xl border p-5 ${aktifSegment.renk}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] opacity-65">Aktif segment</p>
                <h3 className="mt-2 text-2xl font-black">{aktifSegment.baslik}</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed opacity-80">{aktifSegment.aciklama}</p>
              </div>
              <button
                type="button"
                onClick={kopyala}
                disabled={aktifSegment.leadler.length === 0}
                className="rounded-2xl bg-white px-4 py-2 text-xs font-black text-gray-950 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {kopyalandi ? "Kopyalandı" : "Segment özetini kopyala"}
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] opacity-50">Önerilen paket</p>
                <p className="mt-1 text-sm font-black leading-relaxed text-gray-950">{aktifSegment.paket}</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] opacity-50">Sıradaki aksiyon</p>
                <p className="mt-1 text-sm font-black leading-relaxed text-gray-950">{aktifSegment.aksiyon}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-black text-gray-950">Segmentteki kayıtlar</h3>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">
                {aktifSegment.leadler.length} kayıt
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {aktifSegment.leadler.length > 0 ? aktifSegment.leadler.slice(0, 8).map(lead => (
                <div key={lead.id} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-gray-950">{lead.baslik}</p>
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-500">
                        {[lead.etkinlikTuru, lead.kisiSayisi ? `${lead.kisiSayisi} kişi` : null, lead.etkinlikTarihi ? tarihKisa(lead.etkinlikTarihi) : null, lead.kaynak].filter(Boolean).join(" · ") || "Detay eklenmemiş"}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-black text-gray-600 shadow-sm">
                      {DURUM_LABEL[lead.durum]}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                  <p className="text-sm font-bold text-gray-500">Bu segmentte kayıt yok.</p>
                  <p className="mt-1 text-xs text-gray-400">Lead CRM'e etkinlik türü, kişi sayısı ve tarih ekledikçe segmentler daha isabetli çalışır.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-xs font-semibold leading-relaxed text-purple-900">
            Segmentler otomatik öneridir. Nihai teklif, müşterinin açık talebi ve sizin ticari değerlendirmenizle netleşmelidir.
          </div>
        </div>
      </div>
    </section>
  );
}

function OzetKart({ baslik, deger }: { baslik: string; deger: string }) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 px-3 py-2 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400">{baslik}</p>
      <p className="mt-1 text-xl font-black tabular-nums text-gray-950">{deger}</p>
    </div>
  );
}
