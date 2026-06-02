"use client";

import { useMemo, useState } from "react";

type DavetiyeOzeti = {
  slug: string;
  baslik: string;
  aktif: boolean;
  tarih: string | null;
  goruntulenme: number;
  albumAktif: boolean;
  aniDefteriAktif: boolean;
  sesliAniAktif: boolean;
  canliDuvarAktif: boolean;
  oturmaPlanAktif: boolean;
  checkInAktif: boolean;
  aniKitabiAktif: boolean;
  updatedAt: string;
  sayilar: {
    davetli: number;
    rsvp: number;
    foto: number;
    ani: number;
    sesliAni: number;
    masa: number;
  };
};

type Kod = {
  id: string;
  kod: string;
  durum: string;
  createdAt: string;
  kullanilanAt: string | null;
  not: string | null;
  davetiye: DavetiyeOzeti | null;
};

type KitKalemi = {
  id: string;
  baslik: string;
  aciklama: string;
  durum: "hazir" | "kontrol" | "kapali";
};

const OZELLIK_LABEL: Array<{
  key: keyof Pick<
    DavetiyeOzeti,
    "albumAktif" | "aniDefteriAktif" | "sesliAniAktif" | "canliDuvarAktif" | "oturmaPlanAktif" | "checkInAktif" | "aniKitabiAktif"
  >;
  label: string;
}> = [
  { key: "checkInAktif", label: "QR check-in" },
  { key: "oturmaPlanAktif", label: "Oturma planı" },
  { key: "canliDuvarAktif", label: "Canlı duvar" },
  { key: "albumAktif", label: "Fotoğraf albümü" },
  { key: "aniDefteriAktif", label: "Anı defteri" },
  { key: "sesliAniAktif", label: "Sesli anı" },
  { key: "aniKitabiAktif", label: "Anı kitabı PDF" },
];

function urlUret(path: string) {
  const base =
    process.env.NEXT_PUBLIC_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://davetrota.com");
  return `${base}${path}`;
}

function tarihKisa(tarih: string | null) {
  if (!tarih) return "Tarih girilmemiş";
  const date = new Date(tarih);
  if (Number.isNaN(date.getTime())) return "Tarih girilmemiş";
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function kodBasligi(kod: Kod) {
  return kod.not?.trim() || kod.davetiye?.baslik || `Teslim kodu ${kod.kod.slice(0, 6)}`;
}

function medyaPaneli(davetiye: DavetiyeOzeti) {
  if (davetiye.albumAktif || davetiye.canliDuvarAktif) return "foto";
  if (davetiye.aniDefteriAktif) return "ani";
  if (davetiye.sesliAniAktif) return "sesli";
  return null;
}

function kitKalemleri(davetiye: DavetiyeOzeti): KitKalemi[] {
  return [
    {
      id: "davetiye",
      baslik: "Davetiye linki",
      aciklama: davetiye.aktif ? "Yayındaki davetiye linki paylaşım için hazır." : "Davetiye oluşturuldu fakat yayında görünmüyor.",
      durum: davetiye.aktif ? "hazir" : "kontrol",
    },
    {
      id: "qr",
      baslik: "QR baskı kiti",
      aciklama: "Müşteri panelinde QR kiti açılıp masa kartı/giriş panosu çıktısı alınmalı.",
      durum: davetiye.aktif ? "kontrol" : "kapali",
    },
    {
      id: "check-in",
      baslik: "Giriş check-in",
      aciklama: davetiye.checkInAktif
        ? "Giriş ekibine görevli erişimi ve test akışı hazırlanmalı."
        : "QR check-in bu davetiyede kapalı.",
      durum: davetiye.checkInAktif ? "kontrol" : "kapali",
    },
    {
      id: "oturma",
      baslik: "Masa yerleşimi",
      aciklama: davetiye.oturmaPlanAktif
        ? "Müşteri oturma planını son LCV durumuna göre kontrol etmeli."
        : "Oturma planı bu davetiyede kapalı.",
      durum: davetiye.oturmaPlanAktif ? "kontrol" : "kapali",
    },
    {
      id: "canli-duvar",
      baslik: "Canlı duvar ekranı",
      aciklama: davetiye.canliDuvarAktif
        ? "Salon TV/projeksiyonunda canlı duvar linki test edilmeli."
        : "Canlı duvar bu davetiyede kapalı.",
      durum: davetiye.canliDuvarAktif ? "kontrol" : "kapali",
    },
    {
      id: "ani",
      baslik: "Anı toplama QR alanı",
      aciklama: davetiye.albumAktif || davetiye.aniDefteriAktif || davetiye.sesliAniAktif
        ? "Masa QR kartı ve anı gönderim akışı müşteriyle test edilmeli."
        : "Anı/fotoğraf toplama özellikleri kapalı.",
      durum: davetiye.albumAktif || davetiye.aniDefteriAktif || davetiye.sesliAniAktif ? "kontrol" : "kapali",
    },
  ];
}

function kitMetni(firmaAdi: string, kod: Kod, davetiye: DavetiyeOzeti) {
  const davetiyeUrl = urlUret(`/davetiye/${davetiye.slug}`);
  const canliDuvarUrl = davetiye.canliDuvarAktif ? urlUret(`/davetiye/${davetiye.slug}/canli-duvar`) : null;
  const panel = medyaPaneli(davetiye);
  const medyaUrl = panel ? `${davetiyeUrl}?panel=${panel}` : null;
  const aktifOzellikler = OZELLIK_LABEL.filter(item => davetiye[item.key]).map(item => item.label);

  return [
    `Merhaba, ${firmaAdi} etkinlik günü hazırlık kitiniz hazır.`,
    "",
    `Etkinlik: ${davetiye.baslik}`,
    `Tarih: ${tarihKisa(davetiye.tarih)}`,
    `Teslim başlığı: ${kodBasligi(kod)}`,
    "",
    "Kullanılacak linkler:",
    `- Davetiye: ${davetiyeUrl}`,
    canliDuvarUrl ? `- Canlı duvar: ${canliDuvarUrl}` : null,
    medyaUrl ? `- Fotoğraf/anı gönderim alanı: ${medyaUrl}` : null,
    "",
    "Etkinlik öncesi kontrol:",
    "- QR baskı kitini müşteri panelinden indirip masa/giriş alanına yerleştirin.",
    davetiye.checkInAktif ? "- Giriş ekibiyle QR check-in ekranını test edin." : "- QR check-in kapalıysa girişte genel davetiye QR'ını kullanın.",
    davetiye.oturmaPlanAktif ? "- Oturma planını son LCV yanıtlarına göre kontrol edin." : "- Oturma planı kapalıysa masa listesi salon tarafında ayrıca yönetilir.",
    davetiye.canliDuvarAktif ? "- Canlı duvarı salon TV/projeksiyonunda etkinlikten önce açıp test edin." : null,
    medyaUrl ? "- Masa QR kartını görünür şekilde yerleştirip anı/fotoğraf gönderimini test edin." : null,
    "",
    `Aktif özellikler: ${aktifOzellikler.length ? aktifOzellikler.join(", ") : "Temel davetiye"}`,
    "",
    "Gizlilik notu: Bu metin kişi bazlı davetli verisi içermez. Davetli listesi, LCV/RSVP yanıtları ve masa atamaları müşterinin kendi DavetRota hesabında yönetilir.",
  ]
    .filter(Boolean)
    .join("\n");
}

function durumStili(durum: KitKalemi["durum"]) {
  if (durum === "hazir") return "border-emerald-100 bg-emerald-50 text-emerald-700";
  if (durum === "kontrol") return "border-amber-100 bg-amber-50 text-amber-700";
  return "border-gray-100 bg-gray-50 text-gray-500";
}

function durumLabel(durum: KitKalemi["durum"]) {
  if (durum === "hazir") return "Hazır";
  if (durum === "kontrol") return "Kontrol";
  return "Kapalı";
}

export default function PartnerEtkinlikGunuKiti({
  firmaAdi,
  kodlar,
}: {
  firmaAdi: string;
  kodlar: Kod[];
}) {
  const etkinlikler = kodlar.filter(kod => kod.davetiye && kod.durum !== "iptal");
  const [seciliKod, setSeciliKod] = useState(etkinlikler[0]?.kod ?? "");
  const [kopyalanan, setKopyalanan] = useState<"kit" | "linkler" | null>(null);
  const secili = etkinlikler.find(kod => kod.kod === seciliKod) ?? etkinlikler[0] ?? null;
  const davetiye = secili?.davetiye ?? null;
  const kalemler = useMemo(() => (davetiye ? kitKalemleri(davetiye) : []), [davetiye]);
  const hazir = kalemler.filter(kalem => kalem.durum === "hazir").length;
  const kontrol = kalemler.filter(kalem => kalem.durum === "kontrol").length;
  const metin = secili && davetiye ? kitMetni(firmaAdi, secili, davetiye) : "";
  const davetiyeUrl = davetiye ? urlUret(`/davetiye/${davetiye.slug}`) : "";
  const canliDuvarUrl = davetiye?.canliDuvarAktif ? urlUret(`/davetiye/${davetiye.slug}/canli-duvar`) : "";
  const panel = davetiye ? medyaPaneli(davetiye) : null;
  const medyaUrl = davetiye && panel ? `${davetiyeUrl}?panel=${panel}` : "";
  const linkMetni = [davetiyeUrl && `Davetiye: ${davetiyeUrl}`, canliDuvarUrl && `Canlı duvar: ${canliDuvarUrl}`, medyaUrl && `Fotoğraf/anı: ${medyaUrl}`]
    .filter(Boolean)
    .join("\n");

  const kopyala = async (tip: "kit" | "linkler") => {
    const icerik = tip === "kit" ? metin : linkMetni;
    if (!icerik) return;
    try {
      await navigator.clipboard.writeText(icerik);
      setKopyalanan(tip);
      setTimeout(() => setKopyalanan(null), 1800);
    } catch {
      setKopyalanan(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-gray-950 via-purple-950 to-gray-950 px-5 py-6 text-white sm:px-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-200/80">
              Etkinlik günü operasyon kiti
            </p>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">
              Yayındaki davetiyeyi salon akışına çevirin
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              QR baskı, giriş ekibi, canlı duvar, masa planı ve anı QR hazırlığını tek kontrol listesinde toparlar.
              Kişi bazlı davetli verisi göstermez.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center">
              <p className="text-2xl font-black tabular-nums">{etkinlikler.length}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Etkinlik</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center">
              <p className="text-2xl font-black tabular-nums">{hazir}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Hazır</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center">
              <p className="text-2xl font-black tabular-nums">{kontrol}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Kontrol</p>
            </div>
          </div>
        </div>
      </div>

      {secili && davetiye ? (
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px] lg:p-7">
          <div className="space-y-5">
            <label className="block rounded-3xl border border-gray-100 bg-gray-50 p-4">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">Etkinlik seç</span>
              <select
                value={secili.kod}
                onChange={e => setSeciliKod(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              >
                {etkinlikler.map(kod => (
                  <option key={kod.id} value={kod.kod}>
                    {kodBasligi(kod)} - {kod.davetiye?.baslik}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {davetiye.baslik} · {tarihKisa(davetiye.tarih)} · {davetiye.aktif ? "Yayında" : "Yayın kontrolü gerekli"}
              </p>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              {kalemler.map(kalem => (
                <div key={kalem.id} className={`rounded-2xl border p-4 ${durumStili(kalem.durum)}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-black">{kalem.baslik}</p>
                    <span className="shrink-0 rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-black">
                      {durumLabel(kalem.durum)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold leading-relaxed opacity-80">{kalem.aciklama}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-purple-100 bg-purple-50 p-4">
              <p className="text-sm font-black text-purple-950">Public linkler</p>
              <p className="mt-1 text-xs leading-relaxed text-purple-800/70">
                Bu linkler müşteriye veya etkinlik ekibine gönderilebilir. Dashboard yönetim linki içermez.
              </p>
              <div className="mt-3 space-y-2">
                <LinkSatiri label="Davetiye" url={davetiyeUrl} />
                {canliDuvarUrl && <LinkSatiri label="Canlı duvar" url={canliDuvarUrl} />}
                {medyaUrl && <LinkSatiri label="Fotoğraf/anı alanı" url={medyaUrl} />}
              </div>
              <button
                type="button"
                onClick={() => kopyala("linkler")}
                className="mt-3 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-purple-700"
              >
                {kopyalanan === "linkler" ? "Linkler Kopyalandı" : "Linkleri Kopyala"}
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Hazırlık metni</p>
            <h3 className="mt-2 text-lg font-black text-gray-950">Müşteri / ekip paylaşımı</h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Etkinlik öncesi son kontrol için WhatsApp veya e-posta ile gönderilebilir.
            </p>
            <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-2xl bg-gray-950 p-4 text-xs leading-relaxed text-white/80">
              {metin}
            </pre>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => kopyala("kit")}
                className="rounded-2xl bg-purple-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700"
              >
                {kopyalanan === "kit" ? "Kopyalandı" : "Kiti Kopyala"}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(metin)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-[#25D366] px-4 py-3 text-center text-sm font-black text-white transition-opacity hover:opacity-90"
              >
                WhatsApp'ta Aç
              </a>
            </div>
            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-black text-amber-800">Güvenli sınır</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-700">
                Kişiye özel QR, davetli isimleri ve masa atamaları müşterinin kendi panelindedir. Partner ekibi yalnızca operasyon hazırlığını takip eder.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
            QR
          </div>
          <h3 className="text-lg font-black text-gray-950">Henüz etkinlik günü kiti yok</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
            Müşteri davetiyesini oluşturduğunda ve yayın hazırlığı başladığında operasyon kiti burada görünür.
          </p>
          <a
            href="#aktivasyon-kodlari"
            className="mt-4 inline-flex rounded-2xl bg-purple-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700"
          >
            Aktivasyonları Aç
          </a>
        </div>
      )}
    </section>
  );
}

function LinkSatiri({ label, url }: { label: string; url: string }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-purple-400">{label}</p>
      <p className="mt-1 break-all font-mono text-[11px] text-gray-600">{url}</p>
    </div>
  );
}
