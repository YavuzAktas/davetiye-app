"use client";

import { useMemo, useState } from "react";

type Kanal = "reels" | "story" | "post" | "whatsapp" | "bio";
type Odak = "salon" | "davet-evi" | "ani" | "qr" | "premium";
type Ton = "profesyonel" | "samimi" | "premium";
type Cta = "demo" | "teklif" | "whatsapp" | "portal";

type Icerik = {
  baslik: string;
  kanca: string;
  senaryo: string[];
  caption: string;
  whatsapp: string;
  hashtag: string;
  plan: string[];
  guvenliNot: string;
};

const KANALLAR: Array<{ id: Kanal; label: string; aciklama: string }> = [
  { id: "reels", label: "Reels", aciklama: "Kısa video akışı" },
  { id: "story", label: "Story", aciklama: "Hızlı duyuru" },
  { id: "post", label: "Post", aciklama: "Açıklamalı paylaşım" },
  { id: "whatsapp", label: "WhatsApp", aciklama: "Manuel müşteri mesajı" },
  { id: "bio", label: "Bio", aciklama: "Profil metni" },
];

const ODAKLAR: Record<Odak, { label: string; vaat: string; vurgu: string; etiketler: string[] }> = {
  salon: {
    label: "Düğün salonu",
    vaat: "Davetli listesi, RSVP ve giriş akışı tek ekrandan toparlanır.",
    vurgu: "salon operasyonunu daha düzenli gösterme",
    etiketler: ["dugunsalonu", "davetliyonetimi", "dijitaldavetiye"],
  },
  "davet-evi": {
    label: "Davet evi",
    vaat: "Müşteriye modern davetiye, QR ve anı toplama deneyimi sunulur.",
    vurgu: "davet evi hizmetini premium paket gibi anlatma",
    etiketler: ["davetevi", "organizasyon", "etkinlikyonetimi"],
  },
  ani: {
    label: "Anı ve sosyal",
    vaat: "Misafirler fotoğraf, yazılı anı ve sesli anı bırakır; içerikler onay sonrası görünür.",
    vurgu: "etkinlikten sonra elde kalan anı değerini büyütme",
    etiketler: ["anidefteri", "canliduvar", "dugunhatirasi"],
  },
  qr: {
    label: "QR operasyon",
    vaat: "QR check-in, masa QR ve ekip ekranları etkinlik günü karışıklığını azaltır.",
    vurgu: "kapı, masa ve ekip koordinasyonunu sadeleştirme",
    etiketler: ["qrcheckin", "oturmaplani", "etkinlikoperasyonu"],
  },
  premium: {
    label: "Premium paket",
    vaat: "Davetiye, RSVP, QR operasyonu ve anı arşivi tek markalı deneyimde birleşir.",
    vurgu: "müşteriye uçtan uca dijital etkinlik deneyimi sunma",
    etiketler: ["premiumdugun", "dijitaldeneyim", "davetrota"],
  },
};

const TONLAR: Record<Ton, { label: string; giris: string; kapanis: string }> = {
  profesyonel: {
    label: "Profesyonel",
    giris: "Organizasyon sürecinizi daha düzenli ve ölçülebilir hale getirin.",
    kapanis: "Detaylı bilgi ve demo için bize yazabilirsiniz.",
  },
  samimi: {
    label: "Samimi",
    giris: "Davetinizi sadece duyurmakla kalmayın, misafirlerinizi deneyimin içine alın.",
    kapanis: "Size uygun paketi birlikte seçelim.",
  },
  premium: {
    label: "Premium",
    giris: "Etkinliğinizin ilk izlenimi, davetiyenin açıldığı anda başlar.",
    kapanis: "Markalı ve premium deneyim için demo talep edebilirsiniz.",
  },
};

const CTALAR: Record<Cta, { label: string; metin: string }> = {
  demo: { label: "Demo iste", metin: "Demo görmek için bize mesaj atın." },
  teklif: { label: "Teklif al", metin: "Etkinliğinize uygun teklif için bize ulaşın." },
  whatsapp: { label: "WhatsApp", metin: "WhatsApp üzerinden hızlıca bilgi alın." },
  portal: { label: "Partner portalı", metin: "Paketleri ve örnek akışı partner portalımızdan inceleyin." },
};

function temizFirmaAdi(firmaAdi: string) {
  return firmaAdi.trim() || "Organizasyon ekibimiz";
}

function ctaSatiri(cta: Cta, portalUrl?: string | null) {
  if (cta === "portal" && portalUrl) {
    return `${CTALAR[cta].metin}\n${portalUrl}`;
  }
  return CTALAR[cta].metin;
}

function instagramKisa(instagramUrl?: string | null) {
  if (!instagramUrl) return "";
  return instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "@").replace(/\/$/, "");
}

function icerikOlustur({
  firmaAdi,
  kanal,
  odak,
  ton,
  cta,
  portalUrl,
  markaSlogani,
  instagramUrl,
  whatsappImzasi,
}: {
  firmaAdi: string;
  kanal: Kanal;
  odak: Odak;
  ton: Ton;
  cta: Cta;
  portalUrl?: string | null;
  markaSlogani?: string | null;
  instagramUrl?: string | null;
  whatsappImzasi?: string | null;
}): Icerik {
  const firma = temizFirmaAdi(firmaAdi);
  const odakBilgi = ODAKLAR[odak];
  const tonBilgi = TONLAR[ton];
  const ctaMetni = ctaSatiri(cta, portalUrl);
  const slogan = markaSlogani?.trim();
  const instagram = instagramKisa(instagramUrl);
  const imza = whatsappImzasi?.trim();

  const basliklar: Record<Kanal, string> = {
    reels: `${odakBilgi.label} için Reels akışı`,
    story: `${odakBilgi.label} için Story serisi`,
    post: `${odakBilgi.label} için Instagram postu`,
    whatsapp: `${odakBilgi.label} için WhatsApp metni`,
    bio: `${odakBilgi.label} için profil metni`,
  };

  const kanca = `${firma} ile ${odakBilgi.vurgu}: ${odakBilgi.vaat}`;
  const sloganSatiri = slogan ? `\n\n${slogan}` : "";
  const instagramSatiri = instagram ? `\n\n${instagram}` : "";
  const imzaSatiri = imza ? `\n\n${imza}` : "";

  const senaryo: Record<Kanal, string[]> = {
    reels: [
      `1. sahne: "Davetli listesi, RSVP ve QR giriş ayrı ayrı takip edilmek zorunda değil."`,
      `2. sahne: ${firma} panelinde davetiye, QR ve anı akışını gösterin.`,
      `3. sahne: "${odakBilgi.vaat}" metnini ekranda kısa cümlelerle verin.`,
      `4. sahne: Bir masa QR kartı veya örnek davetiye ekranı gösterin.`,
      `5. sahne: "${CTALAR[cta].metin}" kapanışıyla bitirin.`,
    ],
    story: [
      `Story 1: "Etkinlik öncesi davetli takibi zor mu?"`,
      `Story 2: "${odakBilgi.vaat}"`,
      `Story 3: "Davet, RSVP, QR ve anı akışı tek pakette."`,
      `Story 4: "${CTALAR[cta].metin}"`,
    ],
    post: [
      `Kapak: ${firma} ile dijital etkinlik deneyimi`,
      `Gövde: ${odakBilgi.vaat}`,
      "Madde: Davetiye linki, QR, RSVP ve anı akışı tek yerde yönetilir.",
      `Kapanış: ${CTALAR[cta].metin}`,
    ],
    whatsapp: [
      "Mesajı tek tek ve ilişki bulunan müşterilere gönderin.",
      "Toplu izinsiz gönderim yapmayın.",
      "Müşteri adı veya kişisel veri eklemeniz gerekiyorsa yalnızca kendi görüşme notunuz içinde kullanın.",
    ],
    bio: [
      "Profil açıklamasını kısa tutun.",
      "Hizmeti davetiye + operasyon + anı deneyimi olarak anlatın.",
      "CTA için tek link kullanın.",
    ],
  };

  const caption = [
    tonBilgi.giris,
    "",
    `${firma} olarak ${odakBilgi.label.toLocaleLowerCase("tr-TR")} süreçlerinde dijital davetiye, RSVP, QR ve anı toplama akışını tek yerde sunuyoruz.`,
    odakBilgi.vaat,
    sloganSatiri.trim(),
    "",
    ctaMetni,
    instagramSatiri.trim(),
  ]
    .filter(Boolean)
    .join("\n");

  const whatsapp = [
    `Merhaba, ${firma} olarak etkinlikleriniz için dijital davetiye ve operasyon deneyimi sunuyoruz.`,
    "",
    odakBilgi.vaat,
    "",
    "Kapsam örnekleri:",
    "- Dijital davetiye ve paylaşım linki",
    "- RSVP ve davetli durum takibi",
    "- QR check-in ve masa QR akışı",
    "- Onaylı fotoğraf, yazılı anı ve sesli anı toplama",
    "",
    ctaMetni,
    imzaSatiri.trim(),
  ]
    .filter(Boolean)
    .join("\n");

  const hashtag = [
    ...odakBilgi.etiketler,
    "davetiyetasarimi",
    "dugunorganizasyonu",
    "davetrotapartner",
  ]
    .map(etiket => `#${etiket}`)
    .join(" ");

  const plan = [
    "Pazartesi: 15 saniyelik Reels ile davetiye + QR akışını gösterin.",
    "Çarşamba: Story'de soru kutusu açıp demo isteyenleri manuel takip edin.",
    "Cuma: Bir paket kapsamı postu paylaşın ve teklif çağrısı yapın.",
    "Hafta sonu: Etkinlik günü kurulumundan yalnızca izinli, kişisel veri içermeyen görüntü paylaşın.",
  ];

  return {
    baslik: basliklar[kanal],
    kanca,
    senaryo: senaryo[kanal],
    caption,
    whatsapp,
    hashtag,
    plan,
    guvenliNot:
      "Müşteri adı, telefon, e-posta, davetli listesi, yüz görünen fotoğraf veya etkinlik görüntüsünü açık izin olmadan paylaşmayın. Bu paket yalnızca genel tanıtım metni üretir.",
  };
}

function KopyalaButonu({ metin, etiket }: { metin: string; etiket: string }) {
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(metin);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 1800);
    } catch {
      setKopyalandi(false);
    }
  };

  return (
    <button
      type="button"
      onClick={kopyala}
      className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
    >
      {kopyalandi ? "Kopyalandı" : etiket}
    </button>
  );
}

export default function PartnerSosyalMedyaPaketi({
  firmaAdi,
  markaSlogani,
  instagramUrl,
  whatsappImzasi,
  portalUrl,
}: {
  firmaAdi: string;
  markaSlogani?: string | null;
  instagramUrl?: string | null;
  whatsappImzasi?: string | null;
  portalUrl?: string | null;
}) {
  const [kanal, setKanal] = useState<Kanal>("reels");
  const [odak, setOdak] = useState<Odak>("salon");
  const [ton, setTon] = useState<Ton>("profesyonel");
  const [cta, setCta] = useState<Cta>("portal");

  const icerik = useMemo(
    () =>
      icerikOlustur({
        firmaAdi,
        kanal,
        odak,
        ton,
        cta,
        portalUrl,
        markaSlogani,
        instagramUrl,
        whatsappImzasi,
      }),
    [firmaAdi, kanal, odak, ton, cta, portalUrl, markaSlogani, instagramUrl, whatsappImzasi]
  );

  const tumMetin = [
    icerik.baslik,
    "",
    "Kanca:",
    icerik.kanca,
    "",
    "Akış:",
    ...icerik.senaryo.map(satir => `- ${satir}`),
    "",
    "Caption:",
    icerik.caption,
    "",
    "Hashtag:",
    icerik.hashtag,
    "",
    "WhatsApp:",
    icerik.whatsapp,
    "",
    "Güvenli kullanım notu:",
    icerik.guvenliNot,
  ].join("\n");

  return (
    <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
      <div className="border-b border-purple-100 bg-linear-to-br from-purple-50 via-white to-rose-50 px-5 py-5 sm:px-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Sosyal medya paketi</p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Partner hizmetini paylaşmaya hazır metinlere çevirin
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Reels, Story, post ve WhatsApp için marka odaklı tanıtım metni üretir. Müşteri verisi kullanmaz;
              izinli olmayan fotoğraf veya isim paylaşımını özellikle engelleyecek notlarla gelir.
            </p>
          </div>
          <KopyalaButonu metin={tumMetin} etiket="Tüm Paketi Kopyala" />
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[340px_1fr] lg:p-7">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Kanal</p>
            <div className="mt-3 grid gap-2">
              {KANALLAR.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setKanal(item.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                    kanal === item.id
                      ? "border-purple-200 bg-white text-purple-800 shadow-sm"
                      : "border-transparent bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  <span className="block text-sm font-black">{item.label}</span>
                  <span className="mt-1 block text-xs font-semibold text-gray-500">{item.aciklama}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-4">
            <label className="text-xs font-black uppercase tracking-[0.16em] text-gray-400" htmlFor="sosyal-odak">
              Odak
            </label>
            <select
              id="sosyal-odak"
              value={odak}
              onChange={event => setOdak(event.target.value as Odak)}
              className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 outline-none transition-colors focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
            >
              {Object.entries(ODAKLAR).map(([id, item]) => (
                <option key={id} value={id}>
                  {item.label}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-xs font-black uppercase tracking-[0.16em] text-gray-400" htmlFor="sosyal-ton">
              Ton
            </label>
            <select
              id="sosyal-ton"
              value={ton}
              onChange={event => setTon(event.target.value as Ton)}
              className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 outline-none transition-colors focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
            >
              {Object.entries(TONLAR).map(([id, item]) => (
                <option key={id} value={id}>
                  {item.label}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-xs font-black uppercase tracking-[0.16em] text-gray-400" htmlFor="sosyal-cta">
              Çağrı
            </label>
            <select
              id="sosyal-cta"
              value={cta}
              onChange={event => setCta(event.target.value as Cta)}
              className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 outline-none transition-colors focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
            >
              {Object.entries(CTALAR).map(([id, item]) => (
                <option key={id} value={id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-black text-amber-950">Güvenli paylaşım notu</p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-amber-800">{icerik.guvenliNot}</p>
          </div>
        </aside>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Hazır akış</p>
                <h3 className="mt-2 text-lg font-black text-gray-950">{icerik.baslik}</h3>
              </div>
              <KopyalaButonu metin={[icerik.kanca, "", ...icerik.senaryo].join("\n")} etiket="Akışı Kopyala" />
            </div>
            <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold leading-relaxed text-gray-700">
              {icerik.kanca}
            </p>
            <div className="mt-4 grid gap-2">
              {icerik.senaryo.map(satir => (
                <div key={satir} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-gray-600">
                  {satir}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-3xl border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-gray-950">Caption</p>
                <KopyalaButonu metin={icerik.caption} etiket="Kopyala" />
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-gray-50 p-4 text-sm font-semibold leading-relaxed text-gray-700">
                {icerik.caption}
              </pre>
            </article>

            <article className="rounded-3xl border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-gray-950">WhatsApp metni</p>
                <KopyalaButonu metin={icerik.whatsapp} etiket="Kopyala" />
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-gray-50 p-4 text-sm font-semibold leading-relaxed text-gray-700">
                {icerik.whatsapp}
              </pre>
            </article>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
            <article className="rounded-3xl border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-gray-950">Hashtag seti</p>
                <KopyalaButonu metin={icerik.hashtag} etiket="Kopyala" />
              </div>
              <p className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm font-bold leading-relaxed text-purple-700">
                {icerik.hashtag}
              </p>
            </article>

            <article className="rounded-3xl border border-gray-100 bg-white p-5">
              <p className="text-sm font-black text-gray-950">Haftalık paylaşım planı</p>
              <div className="mt-4 grid gap-2">
                {icerik.plan.map(madde => (
                  <div key={madde} className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-semibold leading-relaxed text-gray-600">
                    {madde}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
