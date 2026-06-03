"use client";

import { useMemo, useState } from "react";

type LeadDurum = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";
type Odak = "hiz" | "operasyon" | "ani" | "premium";

type Lead = {
  id: string;
  baslik: string;
  etkinlikTuru: string | null;
  etkinlikTarihi: string | null;
  kisiSayisi: number | null;
  kaynak: string | null;
  durum: LeadDurum;
};

type PaketId = "hizli" | "operasyon" | "ani" | "premium";

type Paket = {
  id: PaketId;
  ad: string;
  kisa: string;
  satisAcisi: string;
  renk: string;
  kapsam: string[];
  neZaman: string;
  sonrakiAksiyon: string;
};

const PAKETLER: Record<PaketId, Paket> = {
  hizli: {
    id: "hizli",
    ad: "Hızlı Dijital Davetiye",
    kisa: "Link, RSVP ve genel QR ile hızlı yayına alma.",
    satisAcisi: "Müşterinin en hızlı değer göreceği teklif. Basılı davetiye yerine hemen paylaşılabilir link vurgusu yapın.",
    renk: "from-indigo-600 to-purple-600",
    kapsam: ["Dijital davetiye", "WhatsApp paylaşım linki", "RSVP takibi", "Genel QR kod"],
    neZaman: "Tarih yakınsa, bütçe hassasiyeti varsa veya müşteri sadece hızlı davetiye istiyorsa.",
    sonrakiAksiyon: "Kısa teklif metni + teslim linki akışını hazırlayın.",
  },
  operasyon: {
    id: "operasyon",
    ad: "Salon Operasyon Paketi",
    kisa: "QR check-in, masa/pano QR ve etkinlik günü akışı.",
    satisAcisi: "Müşterinin operasyon yükünü azaltır. Kapı, masa ve ekip koordinasyonunu ana değer olarak anlatın.",
    renk: "from-emerald-600 to-teal-500",
    kapsam: ["QR check-in", "Masa/pano QR kiti", "Oturma planı", "Personel ekranı"],
    neZaman: "Kişi sayısı yüksekse, salon/davet evi işi ise veya kapıda karışıklık riski varsa.",
    sonrakiAksiyon: "Etkinlik günü operasyon kitini ve salon yerleşim şablonunu gösterin.",
  },
  ani: {
    id: "ani",
    ad: "Anı & Sosyal İçerik Paketi",
    kisa: "Fotoğraf, yazılı/sesli anı ve canlı duvar deneyimi.",
    satisAcisi: "Duygusal ve sosyal değer üretir. Etkinlik sonrası elde kalacak anı arşivini vurgulayın.",
    renk: "from-pink-600 to-rose-500",
    kapsam: ["Fotoğraf albümü", "Anı defteri", "Sesli anı", "Canlı duvar"],
    neZaman: "Düğün/nişan/kına işlerinde, sosyal medya ve hatıra beklentisi yüksekse.",
    sonrakiAksiyon: "Masa QR kartı, canlı duvar ve anı toplama akışını anlatan mesaj gönderin.",
  },
  premium: {
    id: "premium",
    ad: "Premium Etkinlik Deneyimi",
    kisa: "Davetiye, RSVP, QR operasyonu ve anı akışı tek pakette.",
    satisAcisi: "En yüksek algı ve en az parçalı süreç. Tek teklif içinde bütün deneyimi konumlandırın.",
    renk: "from-purple-600 to-fuchsia-600",
    kapsam: ["Lüks şablon", "RSVP hunisi", "QR check-in", "Oturma planı", "Canlı duvar", "Anı arşivi"],
    neZaman: "Premium müşteri, büyük organizasyon veya 'her şey tek yerden olsun' beklentisi varsa.",
    sonrakiAksiyon: "Detaylı teklif oluşturucu ile PDF/WhatsApp metnini hazırlayın.",
  },
};

const ODAKLAR: Record<Odak, { label: string; aciklama: string }> = {
  hiz: { label: "Hızlı teslim", aciklama: "Müşteri hızlıca yayına almak istiyor." },
  operasyon: { label: "Operasyon", aciklama: "Giriş, masa ve ekip akışı önemli." },
  ani: { label: "Anı & sosyal", aciklama: "Fotoğraf, anı ve sosyal görünürlük önemli." },
  premium: { label: "Premium", aciklama: "Tek pakette yüksek algı isteniyor." },
};

const DURUM_LABEL: Record<LeadDurum, string> = {
  yeni: "Yeni",
  gorusuldu: "Görüşüldü",
  teklif_gonderildi: "Teklif gönderildi",
  kapora_bekliyor: "Kapora bekliyor",
  kazandi: "Kazanıldı",
  kaybedildi: "Kaybedildi",
};

function tarihKisa(tarih: string | null) {
  if (!tarih) return "";
  const date = new Date(tarih);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function gunFarki(tarih: string | null) {
  if (!tarih) return null;
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const hedef = new Date(tarih);
  hedef.setHours(0, 0, 0, 0);
  return Math.round((hedef.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));
}

function metin(lead: Lead | null) {
  return `${lead?.baslik ?? ""} ${lead?.etkinlikTuru ?? ""} ${lead?.kaynak ?? ""}`.toLocaleLowerCase("tr-TR");
}

function dugunAilesiMi(lead: Lead | null) {
  return ["düğün", "dugun", "nişan", "nisan", "kına", "kina", "söz", "soz"].some(kelime => metin(lead).includes(kelime));
}

function kurumsalMi(lead: Lead | null) {
  return ["kurumsal", "şirket", "sirket", "lansman", "açılış", "acilis", "bayi", "gala", "mezuniyet"].some(kelime => metin(lead).includes(kelime));
}

function skorla(lead: Lead | null, odak: Odak, butce: "dusuk" | "orta" | "yuksek") {
  const skor: Record<PaketId, number> = { hizli: 0, operasyon: 0, ani: 0, premium: 0 };
  const nedenler: string[] = [];
  const gun = gunFarki(lead?.etkinlikTarihi ?? null);
  const kisi = lead?.kisiSayisi ?? 0;

  if (!lead) {
    skor.hizli += 2;
    nedenler.push("Lead seçilmediği için genel başlangıç paketi güvenli varsayım olarak öne çıkar.");
  }

  if (gun !== null && gun >= 0 && gun <= 30) {
    skor.hizli += 3;
    skor.operasyon += 1;
    nedenler.push("Etkinlik tarihi yakın; hızlı teslim ve net operasyon akışı daha ikna edici olur.");
  }

  if (kisi >= 250) {
    skor.operasyon += 3;
    skor.premium += 2;
    nedenler.push("Kişi sayısı yüksek; QR check-in, oturma planı ve ekip koordinasyonu değer yaratır.");
  } else if (kisi > 0 && kisi <= 80) {
    skor.hizli += 1;
    skor.ani += 1;
    nedenler.push("Daha küçük etkinliklerde hızlı kurulum veya anı deneyimi daha kolay satılır.");
  }

  if (dugunAilesiMi(lead)) {
    skor.ani += 3;
    skor.premium += 2;
    nedenler.push("Düğün/nişan/kına türünde fotoğraf, anı ve canlı duvar duygusal değer üretir.");
  }

  if (kurumsalMi(lead)) {
    skor.operasyon += 3;
    skor.premium += 1;
    nedenler.push("Kurumsal/davet evi işlerinde raporlama, giriş ve operasyon düzeni daha önemlidir.");
  }

  if (lead?.durum === "teklif_gonderildi" || lead?.durum === "kapora_bekliyor") {
    skor.premium += 1;
    skor.operasyon += 1;
    nedenler.push("Lead sıcak aşamada; kapsamı net ve güçlü paketle kapatma şansı yüksek.");
  }

  if (odak === "hiz") skor.hizli += 3;
  if (odak === "operasyon") skor.operasyon += 3;
  if (odak === "ani") skor.ani += 3;
  if (odak === "premium") skor.premium += 3;

  if (butce === "dusuk") {
    skor.hizli += 3;
    skor.premium -= 1;
    nedenler.push("Bütçe hassasiyeti varsa küçük kapsamla başlamak daha güvenlidir.");
  }
  if (butce === "yuksek") {
    skor.premium += 3;
    skor.operasyon += 1;
    skor.ani += 1;
    nedenler.push("Bütçe alanı varsa tek pakette premium deneyim daha yüksek gelir bırakır.");
  }

  const sirali = (Object.entries(skor) as Array<[PaketId, number]>).sort((a, b) => b[1] - a[1]);
  return {
    anaPaket: PAKETLER[sirali[0][0]],
    alternatif: PAKETLER[sirali[1][0]],
    skor,
    nedenler: nedenler.slice(0, 4),
  };
}

function itirazlar(paket: Paket) {
  if (paket.id === "hizli") {
    return [
      ["Sadece WhatsApp ile duyururuz.", "WhatsApp linki yine kullanılır; farkı RSVP ve QR takibinin tek panelde kalmasıdır."],
      ["Basit olsun.", "Bu paket zaten minimum kapsamdır; müşteriye hızlı başlangıç sağlar."],
    ];
  }
  if (paket.id === "operasyon") {
    return [
      ["Kapıda listeyle bakarız.", "QR check-in, kalabalıkta hız ve kayıt netliği sağlar; ekip aynı ekrandan ilerler."],
      ["Masa planı zor olur.", "Müşteri kendi panelinde düzenler; partner yalnızca operasyon kontrolünü takip eder."],
    ];
  }
  if (paket.id === "ani") {
    return [
      ["Fotoğrafları sonra isteriz.", "Masa QR ile misafirlerden içerik etkinlik anında toplanır; sonradan kovalamaya gerek kalmaz."],
      ["Canlı duvar şart mı?", "Şart değil; ama etkinlik içinde görünürlük ve sosyal etki yaratır."],
    ];
  }
  return [
    ["Bize fazla gelir.", "Kapsamı tek pakette topladığı için ayrı ayrı koordinasyon maliyetini azaltır."],
    ["Önce temel deneyelim.", "Alternatif olarak hızlı paketle başlayıp operasyon/anı özelliklerini ek satış olarak sunabilirsiniz."],
  ];
}

function satisMetni({
  firmaAdi,
  lead,
  paket,
  alternatif,
}: {
  firmaAdi: string;
  lead: Lead | null;
  paket: Paket;
  alternatif: Paket;
}) {
  const detaylar = lead
    ? [lead.etkinlikTuru, lead.kisiSayisi ? `${lead.kisiSayisi} kişi` : null, tarihKisa(lead.etkinlikTarihi)]
        .filter(Boolean)
        .join(" · ")
    : "";

  return [
    `Merhaba, ${firmaAdi} olarak bu etkinlik için ${paket.ad} paketini önerebiliriz.`,
    detaylar ? `\nEtkinlik bağlamı: ${detaylar}` : null,
    "",
    paket.satisAcisi,
    "",
    "Kapsam:",
    ...paket.kapsam.map(madde => `- ${madde}`),
    "",
    `Alternatif daha sade seçenek: ${alternatif.ad}`,
    "",
    "Davetli listesi, RSVP yanıtları ve anı içerikleri müşterinin kendi DavetRota hesabında yönetilir.",
    "Uygun görürseniz teklif kapsamını ve teslim adımlarını netleştirebiliriz.",
  ]
    .filter(Boolean)
    .join("\n");
}

export default function PartnerSatisAsistani({
  firmaAdi,
  leadler,
}: {
  firmaAdi: string;
  leadler: Lead[];
}) {
  const [leadId, setLeadId] = useState("");
  const [odak, setOdak] = useState<Odak>("premium");
  const [butce, setButce] = useState<"dusuk" | "orta" | "yuksek">("orta");
  const [kopyalandi, setKopyalandi] = useState<"metin" | "ozet" | null>(null);

  const seciliLead = useMemo(() => leadler.find(lead => lead.id === leadId) ?? null, [leadId, leadler]);
  const sonuc = useMemo(() => skorla(seciliLead, odak, butce), [butce, odak, seciliLead]);
  const mesaj = useMemo(
    () => satisMetni({ firmaAdi, lead: seciliLead, paket: sonuc.anaPaket, alternatif: sonuc.alternatif }),
    [firmaAdi, sonuc.alternatif, sonuc.anaPaket, seciliLead]
  );
  const ozet = [
    `Önerilen paket: ${sonuc.anaPaket.ad}`,
    `Alternatif: ${sonuc.alternatif.ad}`,
    "",
    "Nedenler:",
    ...sonuc.nedenler.map(neden => `- ${neden}`),
    "",
    `Sıradaki aksiyon: ${sonuc.anaPaket.sonrakiAksiyon}`,
  ].join("\n");

  const kopyala = async (tip: "metin" | "ozet") => {
    try {
      await navigator.clipboard.writeText(tip === "metin" ? mesaj : ozet);
      setKopyalandi(tip);
      setTimeout(() => setKopyalandi(null), 1800);
    } catch {
      setKopyalandi(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-white via-purple-50 to-pink-50 px-5 py-6 sm:px-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Satış asistanı</p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Lead'e göre en mantıklı paketi öner
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Etkinlik türü, kişi sayısı, tarih yakınlığı ve satış odağına göre paket önerisi üretir.
              Müşteri iletişim bilgisi göstermez; teklif kararını hızlandırır.
            </p>
          </div>
          <a
            href="#teklif"
            className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-4 py-3 text-xs font-black text-white transition-colors hover:bg-purple-700"
          >
            Teklife Geç
          </a>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[360px_1fr] lg:p-7">
        <div className="space-y-4">
          <label className="block rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <span className="text-xs font-bold text-gray-500">Lead seç</span>
            <select
              value={leadId}
              onChange={e => setLeadId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            >
              <option value="">Lead seçmeden genel öneri</option>
              {leadler.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.baslik} · {DURUM_LABEL[lead.durum]}
                </option>
              ))}
            </select>
            {seciliLead && (
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {[seciliLead.etkinlikTuru, seciliLead.kisiSayisi ? `${seciliLead.kisiSayisi} kişi` : null, tarihKisa(seciliLead.etkinlikTarihi)]
                  .filter(Boolean)
                  .join(" · ") || "Detay eklenmemiş"}
              </p>
            )}
          </label>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-bold text-gray-500">Satış odağı</p>
            <div className="mt-3 grid gap-2">
              {(Object.entries(ODAKLAR) as Array<[Odak, { label: string; aciklama: string }]>).map(([id, item]) => {
                const secili = odak === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setOdak(id)}
                    className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                      secili
                        ? "border-purple-200 bg-purple-50 text-purple-900"
                        : "border-gray-100 bg-white text-gray-600 hover:border-purple-100"
                    }`}
                  >
                    <p className="text-sm font-black">{item.label}</p>
                    <p className="mt-0.5 text-xs font-semibold leading-relaxed opacity-70">{item.aciklama}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <span className="text-xs font-bold text-gray-500">Bütçe algısı</span>
            <select
              value={butce}
              onChange={e => setButce(e.target.value as "dusuk" | "orta" | "yuksek")}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            >
              <option value="dusuk">Bütçe hassas</option>
              <option value="orta">Orta</option>
              <option value="yuksek">Premiuma açık</option>
            </select>
          </label>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-gray-950 text-white">
            <div className={`h-2 bg-linear-to-r ${sonuc.anaPaket.renk}`} />
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">Önerilen ana paket</p>
              <h3 className="mt-2 text-2xl font-black">{sonuc.anaPaket.ad}</h3>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-white/65">{sonuc.anaPaket.kisa}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/75">{sonuc.anaPaket.satisAcisi}</p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {sonuc.anaPaket.kapsam.map(madde => (
                  <div key={madde} className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-xs font-bold text-white/75">
                    {madde}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-purple-100 bg-purple-50 p-4">
              <p className="text-sm font-black text-purple-950">Neden bu paket?</p>
              <div className="mt-3 space-y-2">
                {sonuc.nedenler.length > 0 ? sonuc.nedenler.map(neden => (
                  <p key={neden} className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold leading-relaxed text-purple-900">
                    {neden}
                  </p>
                )) : (
                  <p className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold leading-relaxed text-purple-900">
                    Lead detayları arttıkça öneri daha netleşir.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-black text-gray-950">Alternatif seçenek</p>
              <p className="mt-2 text-lg font-black text-gray-900">{sonuc.alternatif.ad}</p>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-500">{sonuc.alternatif.neZaman}</p>
              <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs font-black text-gray-700">
                {sonuc.anaPaket.sonrakiAksiyon}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-gray-950">Hazır teklif mesajı</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Müşteriye göndermeden önce fiyat ve kapsamı kendi teklifinize göre düzenleyin.
                </p>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <button
                  type="button"
                  onClick={() => kopyala("ozet")}
                  className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-black text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {kopyalandi === "ozet" ? "Kopyalandı" : "Özeti Kopyala"}
                </button>
                <button
                  type="button"
                  onClick={() => kopyala("metin")}
                  className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-purple-700"
                >
                  {kopyalandi === "metin" ? "Kopyalandı" : "Mesajı Kopyala"}
                </button>
              </div>
            </div>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-gray-950 p-4 text-xs leading-relaxed text-white/85">
              {mesaj}
            </pre>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-black text-amber-900">Muhtemel itiraz cevapları</p>
            <div className="mt-3 space-y-2">
              {itirazlar(sonuc.anaPaket).map(([itiraz, cevap]) => (
                <div key={itiraz} className="rounded-2xl bg-white px-3 py-3">
                  <p className="text-xs font-black text-amber-900">{itiraz}</p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-amber-800/80">{cevap}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
