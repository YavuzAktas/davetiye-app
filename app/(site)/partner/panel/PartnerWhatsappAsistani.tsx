"use client";

import { useMemo, useState } from "react";

type LeadDurum = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";

type Lead = {
  id: string;
  baslik: string;
  ilgiliKisi: string | null;
  telefon: string | null;
  etkinlikTuru: string | null;
  etkinlikTarihi: string | null;
  kisiSayisi: number | null;
  durum: LeadDurum;
};

type SenaryoId = "ilk_temas" | "paket_onerisi" | "takip" | "aktivasyon" | "etkinlik_oncesi";
type TonId = "samimi" | "profesyonel" | "premium";
type PaketId = "hizli" | "operasyon" | "ani" | "premium";

const SENARYOLAR: { id: SenaryoId; label: string; aciklama: string }[] = [
  { id: "ilk_temas", label: "İlk temas", aciklama: "Yeni müşteri adayına hizmeti kısa anlatır." },
  { id: "paket_onerisi", label: "Paket önerisi", aciklama: "Seçili paketin değerini öne çıkarır." },
  { id: "takip", label: "Nazik takip", aciklama: "Cevap gelmeyen müşteriye baskısız dönüş yapar." },
  { id: "aktivasyon", label: "Aktivasyon teslimi", aciklama: "Hazır aktivasyon linki gönderirken kullanılır." },
  { id: "etkinlik_oncesi", label: "Etkinlik öncesi", aciklama: "QR, RSVP ve anı araçlarını hatırlatır." },
];

const TONLAR: { id: TonId; label: string }[] = [
  { id: "profesyonel", label: "Profesyonel" },
  { id: "samimi", label: "Samimi" },
  { id: "premium", label: "Premium" },
];

const PAKETLER: Record<PaketId, { label: string; deger: string; maddeler: string[] }> = {
  hizli: {
    label: "Hızlı Dijital Davetiye",
    deger: "davetiye linki, QR paylaşımı ve RSVP takibini hızlıca yayına almak",
    maddeler: ["Dijital davetiye", "WhatsApp paylaşım linki", "RSVP takibi", "Genel QR kod"],
  },
  operasyon: {
    label: "Salon Operasyon Paketi",
    deger: "etkinlik günü giriş, QR ve davetli akışını daha düzenli yönetmek",
    maddeler: ["QR check-in", "Masa/pano QR kiti", "Davetli durum takibi", "Personel ekranı"],
  },
  ani: {
    label: "Anı & Sosyal İçerik Paketi",
    deger: "misafirlerden fotoğraf, yazılı/sesli anı ve canlı duvar içeriği toplamak",
    maddeler: ["Fotoğraf albümü", "Anı defteri", "Sesli anı", "Canlı duvar"],
  },
  premium: {
    label: "Premium Etkinlik Deneyimi",
    deger: "davetiye, RSVP, QR operasyonu ve anı akışını tek deneyimde toplamak",
    maddeler: ["Lüks şablon", "RSVP hunisi", "QR check-in", "Oturma planı", "Canlı duvar"],
  },
};

function tarihKisa(tarih: string | null) {
  if (!tarih) return "";
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function telefonTemizle(telefon: string | null) {
  const rakamlar = telefon?.replace(/\D/g, "") ?? "";
  if (!rakamlar) return "";
  if (rakamlar.startsWith("90")) return rakamlar;
  if (rakamlar.startsWith("0")) return `9${rakamlar}`;
  if (rakamlar.length === 10) return `90${rakamlar}`;
  return rakamlar;
}

function selamlama(lead: Lead | null, ton: TonId) {
  const kisi = lead?.ilgiliKisi?.trim();
  if (kisi) return ton === "samimi" ? `Merhaba ${kisi},` : `Merhaba ${kisi},`;
  return ton === "premium" ? "Merhaba," : "Merhaba,";
}

function kapanis(firmaAdi: string, ton: TonId, imza?: string | null) {
  const satirlar = [
    ton === "samimi"
      ? "İsterseniz size uygun akışı birlikte netleştirebiliriz."
      : "Uygun görürseniz kapsamı ve sonraki adımları netleştirebiliriz.",
    "",
    imza?.trim() || firmaAdi,
  ];
  return satirlar.join("\n");
}

function leadBaglami(lead: Lead | null) {
  if (!lead) return "";
  const detaylar = [
    lead.etkinlikTuru,
    tarihKisa(lead.etkinlikTarihi),
    lead.kisiSayisi ? `${lead.kisiSayisi} kişi` : "",
  ].filter(Boolean);

  return detaylar.length ? `\n\nNot: ${detaylar.join(" · ")} için konuştuğumuz dijital etkinlik akışı üzerinden ilerleyebiliriz.` : "";
}

function mesajOlustur({
  firmaAdi,
  imza,
  lead,
  senaryo,
  ton,
  paket,
  aktivasyonLinki,
}: {
  firmaAdi: string;
  imza?: string | null;
  lead: Lead | null;
  senaryo: SenaryoId;
  ton: TonId;
  paket: PaketId;
  aktivasyonLinki: string;
}) {
  const paketBilgi = PAKETLER[paket];
  const giris = selamlama(lead, ton);
  const baglam = leadBaglami(lead);

  if (senaryo === "ilk_temas") {
    return [
      giris,
      "",
      `${firmaAdi} olarak etkinliğiniz için dijital davetiye ve etkinlik günü araçları sunabiliyoruz.`,
      `Bu yapı ile ${paketBilgi.deger} mümkün olur.`,
      baglam,
      "",
      "Misafirler uygulama indirmeden bağlantıyı açabilir; davetli listesi ve yanıtlar müşterinin kendi hesabında yönetilir.",
      "",
      kapanis(firmaAdi, ton, imza),
    ].join("\n");
  }

  if (senaryo === "paket_onerisi") {
    return [
      giris,
      "",
      `Sizin için ${paketBilgi.label} daha uygun görünüyor.`,
      "",
      "Paket kapsamı:",
      ...paketBilgi.maddeler.map(madde => `- ${madde}`),
      baglam,
      "",
      "Bu teklif taslak kapsamdır; fiyat ve ek talepleri ayrıca netleştirebiliriz.",
      "",
      kapanis(firmaAdi, ton, imza),
    ].join("\n");
  }

  if (senaryo === "takip") {
    return [
      giris,
      "",
      "Dijital davetiye ve etkinlik araçlarıyla ilgili önceki görüşmemizi nazikçe hatırlatmak istedim.",
      `İsterseniz ${paketBilgi.label} kapsamıyla ilerleyebiliriz.`,
      baglam,
      "",
      "Müsait olduğunuzda size uygun paketi ve teslim adımlarını birlikte netleştirebiliriz.",
      "",
      kapanis(firmaAdi, ton, imza),
    ].join("\n");
  }

  if (senaryo === "aktivasyon") {
    const linkSatiri = aktivasyonLinki.trim() || "{{aktivasyon_linki}}";
    return [
      giris,
      "",
      `${firmaAdi} dijital davetiye teslim bağlantınız hazır:`,
      linkSatiri,
      "",
      "Bağlantıyı açıp hesabınızla devam ederek şablon seçebilir, davetiyenizi yayına alabilirsiniz.",
      "Davetli listesi, RSVP yanıtları ve anı içerikleri sizin hesabınızda yönetilir.",
      "",
      kapanis(firmaAdi, ton, imza),
    ].join("\n");
  }

  return [
    giris,
    "",
    "Etkinlik öncesi son kontroller için küçük bir hatırlatma paylaşmak istedim.",
    "",
    "- Davetiye linkinizi ve QR kodunuzu test edin",
    "- RSVP yanıtlarını ve kişi sayısını kontrol edin",
    "- Kullanıyorsanız QR check-in ve canlı duvar ekranını önceden açıp deneyin",
    "- Masa QR kartlarını görünür yerlere koyun",
    baglam,
    "",
    kapanis(firmaAdi, ton, imza),
  ].join("\n");
}

export default function PartnerWhatsappAsistani({
  firmaAdi,
  whatsappImzasi,
  leadler,
}: {
  firmaAdi: string;
  whatsappImzasi?: string | null;
  leadler: Lead[];
}) {
  const [leadId, setLeadId] = useState("");
  const [senaryo, setSenaryo] = useState<SenaryoId>("ilk_temas");
  const [ton, setTon] = useState<TonId>("profesyonel");
  const [paket, setPaket] = useState<PaketId>("premium");
  const [aktivasyonLinki, setAktivasyonLinki] = useState("");
  const [kopyalandi, setKopyalandi] = useState(false);

  const seciliLead = useMemo(() => leadler.find(lead => lead.id === leadId) ?? null, [leadId, leadler]);
  const mesaj = useMemo(
    () => mesajOlustur({ firmaAdi, imza: whatsappImzasi, lead: seciliLead, senaryo, ton, paket, aktivasyonLinki }),
    [aktivasyonLinki, firmaAdi, paket, seciliLead, senaryo, ton, whatsappImzasi]
  );
  const temizTelefon = telefonTemizle(seciliLead?.telefon ?? null);
  const whatsappUrl = temizTelefon
    ? `https://wa.me/${temizTelefon}?text=${encodeURIComponent(mesaj)}`
    : `https://wa.me/?text=${encodeURIComponent(mesaj)}`;

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(mesaj);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      setKopyalandi(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">WhatsApp satış asistanı</p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Lead'e göre güvenli mesaj taslağı üret
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Mesajlar otomatik gönderilmez. Partner metni kontrol eder, gerekirse düzenler ve WhatsApp üzerinden manuel
              gönderir.
            </p>
          </div>
          <a
            href="#lead-crm"
            className="inline-flex items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-xs font-black text-purple-700 transition-colors hover:bg-purple-100"
          >
            Lead CRM'e Git
          </a>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[360px_1fr] lg:p-7">
        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-bold text-gray-500">Lead seç</span>
              <select
                value={leadId}
                onChange={e => setLeadId(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
              >
                <option value="">Lead seçmeden oluştur</option>
                {leadler.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.baslik}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-gray-500">Senaryo</span>
              <select
                value={senaryo}
                onChange={e => setSenaryo(e.target.value as SenaryoId)}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
              >
                {SENARYOLAR.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
              <span className="mt-1 block text-xs font-semibold leading-relaxed text-gray-400">
                {SENARYOLAR.find(item => item.id === senaryo)?.aciklama}
              </span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Ton</span>
                <select
                  value={ton}
                  onChange={e => setTon(e.target.value as TonId)}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                >
                  {TONLAR.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-500">Paket</span>
                <select
                  value={paket}
                  onChange={e => setPaket(e.target.value as PaketId)}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                >
                  {Object.entries(PAKETLER).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
                </select>
              </label>
            </div>

            {senaryo === "aktivasyon" && (
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Aktivasyon linki</span>
                <input
                  value={aktivasyonLinki}
                  onChange={e => setAktivasyonLinki(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                />
              </label>
            )}
          </div>

          {seciliLead && (
            <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50 p-4">
              <p className="text-xs font-black text-purple-800">Seçili lead</p>
              <p className="mt-1 text-sm font-black text-gray-950">{seciliLead.baslik}</p>
              <p className="mt-1 text-xs leading-relaxed text-purple-800/75">
                {[seciliLead.etkinlikTuru, tarihKisa(seciliLead.etkinlikTarihi), seciliLead.kisiSayisi ? `${seciliLead.kisiSayisi} kişi` : ""]
                  .filter(Boolean)
                  .join(" · ") || "Ek detay yok"}
              </p>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-black text-amber-800">Güvenli gönderim notu</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Toplu/izinsiz gönderim yapmayın. Müşteriyle mevcut görüşme ilişkisi varsa manuel mesaj olarak kullanın;
              hassas veri ve kart bilgisi istemeyin.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black text-gray-950">Mesaj önizlemesi</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Göndermeden önce metni okuyup müşteriye göre düzenleyin.
              </p>
            </div>
            <div className="flex gap-2 sm:shrink-0">
              <button
                type="button"
                onClick={kopyala}
                className="rounded-xl bg-white px-3 py-2 text-xs font-black text-gray-700 ring-1 ring-gray-200 transition-colors hover:text-purple-700"
              >
                {kopyalandi ? "Kopyalandı" : "Kopyala"}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#25D366] px-3 py-2 text-xs font-black text-white transition-opacity hover:opacity-90"
              >
                WhatsApp'ta Aç
              </a>
            </div>
          </div>

          <pre className="mt-4 min-h-80 whitespace-pre-wrap rounded-2xl bg-gray-950 p-4 text-sm leading-relaxed text-white/85">
            {mesaj}
          </pre>
        </div>
      </div>
    </section>
  );
}
