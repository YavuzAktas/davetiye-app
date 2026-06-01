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

const DURUM_META: Record<string, { label: string; aciklama: string; cls: string }> = {
  olusturuldu: {
    label: "Link hazır",
    aciklama: "Aktivasyon bağlantısı oluşturuldu, müşteriye gönderilmeyi bekliyor.",
    cls: "bg-gray-100 text-gray-700",
  },
  gonderildi: {
    label: "Müşteriye gönderildi",
    aciklama: "Teslim bağlantısı paylaşıldı, müşterinin kuruluma başlaması bekleniyor.",
    cls: "bg-blue-50 text-blue-700",
  },
  kayit_oldu: {
    label: "Kurulum başladı",
    aciklama: "Müşteri bağlantıyı kullandı ve hesabıyla devam etti.",
    cls: "bg-amber-50 text-amber-700",
  },
  odeme_bekliyor: {
    label: "Ek özellik bekliyor",
    aciklama: "Kurulum devam ediyor; paket dışı özellik veya ödeme adımı bekliyor.",
    cls: "bg-orange-50 text-orange-700",
  },
  davetiye_olusturuldu: {
    label: "Davetiye oluşturuldu",
    aciklama: "Davetiye paneli açıldı, son kontroller ve yayın hazırlığı yapılabilir.",
    cls: "bg-purple-50 text-purple-700",
  },
  yayinda: {
    label: "Yayında",
    aciklama: "Davetiye yayında. Link, QR ve etkinlik günü araçları kullanılabilir.",
    cls: "bg-emerald-50 text-emerald-700",
  },
  iptal: {
    label: "İptal",
    aciklama: "Bu aktivasyon bağlantısı iptal edildi.",
    cls: "bg-red-50 text-red-700",
  },
};

const OZELLIKLER: Array<{
  key: keyof Pick<
    DavetiyeOzeti,
    "albumAktif" | "aniDefteriAktif" | "sesliAniAktif" | "canliDuvarAktif" | "oturmaPlanAktif" | "checkInAktif" | "aniKitabiAktif"
  >;
  label: string;
  teslim: string;
}> = [
  { key: "albumAktif", label: "Fotoğraf albümü", teslim: "Misafir fotoğraf alanı" },
  { key: "aniDefteriAktif", label: "Anı defteri", teslim: "Yazılı anı toplama alanı" },
  { key: "sesliAniAktif", label: "Sesli anı", teslim: "Sesli anı toplama alanı" },
  { key: "canliDuvarAktif", label: "Canlı duvar", teslim: "Etkinlik ekranı için canlı duvar" },
  { key: "oturmaPlanAktif", label: "Oturma planı", teslim: "Masa ve oturma planı aracı" },
  { key: "checkInAktif", label: "QR check-in", teslim: "Giriş ekibi için QR check-in" },
  { key: "aniKitabiAktif", label: "Anı kitabı PDF", teslim: "Etkinlik sonrası anı arşivi" },
];

function tarihKisa(tarih: string | null) {
  if (!tarih) return "Tarih girilmemiş";
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function tarihSaat(tarih: string | null) {
  if (!tarih) return "-";
  return new Date(tarih).toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function urlUret(path: string) {
  const base =
    process.env.NEXT_PUBLIC_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://davetiye-app.vercel.app");
  return `${base}${path}`;
}

function durumMeta(durum: string) {
  return DURUM_META[durum] ?? {
    label: durum,
    aciklama: "Teslim durumu takip ediliyor.",
    cls: "bg-gray-100 text-gray-700",
  };
}

function kodBasligi(kod: Kod) {
  return kod.not?.trim() || kod.davetiye?.baslik || `Teslim kodu ${kod.kod.slice(0, 6)}`;
}

function raporMetni(firmaAdi: string, kod: Kod) {
  const davetiye = kod.davetiye;
  const portalUrl = urlUret(`/partner/aktivasyon/${kod.kod}`);
  const davetiyeUrl = davetiye ? urlUret(`/davetiye/${davetiye.slug}`) : null;
  const aktifOzellikler = davetiye
    ? OZELLIKLER.filter(ozellik => davetiye[ozellik.key]).map(ozellik => ozellik.teslim)
    : [];

  return [
    `Merhaba, ${firmaAdi} dijital davetiye teslim raporunuz hazır.`,
    "",
    `Teslim başlığı: ${kodBasligi(kod)}`,
    `Durum: ${durumMeta(kod.durum).label}`,
    `Son güncelleme: ${tarihSaat(davetiye?.updatedAt ?? kod.kullanilanAt ?? kod.createdAt)}`,
    "",
    davetiye
      ? `Davetiye: ${davetiye.baslik} (${tarihKisa(davetiye.tarih)})`
      : "Davetiye henüz müşteri tarafından oluşturulmadı.",
    davetiyeUrl ? `Davetiye linki: ${davetiyeUrl}` : null,
    `Müşteri teslim portalı: ${portalUrl}`,
    "",
    "Teslim kapsamı:",
    "- Dijital davetiye bağlantısı",
    "- Müşteri teslim portalı",
    "- Genel paylaşım/QR yönlendirmesi",
    ...aktifOzellikler.map(ozellik => `- ${ozellik}`),
    "",
    davetiye
      ? [
          "Kullanım özeti:",
          `- Görüntülenme: ${davetiye.goruntulenme}`,
          `- Davetli kaydı: ${davetiye.sayilar.davetli}`,
          `- RSVP yanıtı: ${davetiye.sayilar.rsvp}`,
          `- Fotoğraf: ${davetiye.sayilar.foto}`,
          `- Yazılı anı: ${davetiye.sayilar.ani}`,
          `- Sesli anı: ${davetiye.sayilar.sesliAni}`,
          `- Masa: ${davetiye.sayilar.masa}`,
          "",
        ].join("\n")
      : null,
    "",
    "Gizlilik notu: Bu rapor kişisel davetli verisi içermez; yalnızca teslim durumu ve toplam kullanım sayılarını özetler.",
  ]
    .filter(Boolean)
    .join("\n");
}

export default function PartnerTeslimRaporu({
  firmaAdi,
  kodlar,
}: {
  firmaAdi: string;
  kodlar: Kod[];
}) {
  const raporlanabilirKodlar = kodlar.filter(kod => kod.durum !== "iptal");
  const [seciliKod, setSeciliKod] = useState(raporlanabilirKodlar[0]?.kod ?? "");
  const [kopyalandi, setKopyalandi] = useState(false);

  const secili = raporlanabilirKodlar.find(kod => kod.kod === seciliKod) ?? raporlanabilirKodlar[0] ?? null;
  const meta = secili ? durumMeta(secili.durum) : null;

  const ozet = useMemo(() => {
    const yayinda = raporlanabilirKodlar.filter(kod => kod.durum === "yayinda").length;
    const davetiyeOlusan = raporlanabilirKodlar.filter(kod => kod.davetiye).length;
    const toplamGoruntulenme = raporlanabilirKodlar.reduce((toplam, kod) => toplam + (kod.davetiye?.goruntulenme ?? 0), 0);
    const toplamRsvp = raporlanabilirKodlar.reduce((toplam, kod) => toplam + (kod.davetiye?.sayilar.rsvp ?? 0), 0);
    return { yayinda, davetiyeOlusan, toplamGoruntulenme, toplamRsvp };
  }, [raporlanabilirKodlar]);

  const metin = secili ? raporMetni(firmaAdi, secili) : "";
  const portalUrl = secili ? urlUret(`/partner/aktivasyon/${secili.kod}`) : "";
  const davetiyeUrl = secili?.davetiye ? urlUret(`/davetiye/${secili.davetiye.slug}`) : "";

  const kopyala = async () => {
    if (!metin) return;
    await navigator.clipboard.writeText(metin);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 1800);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-emerald-50 via-white to-purple-50 px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              Teslim ve Başarı Raporu
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Müşteriye güven veren teslim çıktısı
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Aktivasyon, yayın ve kullanım sayılarını kişisel veri göstermeden özetler. WhatsApp veya e-posta ile müşteriye gönderilebilir.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[430px]">
            <OzetKart baslik="Yayında" deger={ozet.yayinda.toString()} />
            <OzetKart baslik="Davetiye" deger={ozet.davetiyeOlusan.toString()} />
            <OzetKart baslik="Görüntülenme" deger={ozet.toplamGoruntulenme.toString()} />
            <OzetKart baslik="RSVP" deger={ozet.toplamRsvp.toString()} />
          </div>
        </div>
      </div>

      {secili && meta ? (
        <div className="grid gap-5 p-5 lg:grid-cols-[0.95fr_1.05fr] sm:p-7">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">Rapor seç</span>
              <select
                value={secili.kod}
                onChange={e => setSeciliKod(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              >
                {raporlanabilirKodlar.map(kod => (
                  <option key={kod.id} value={kod.kod}>
                    {kodBasligi(kod)} - {durumMeta(kod.durum).label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-black text-gray-950">{kodBasligi(secili)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{meta.aciklama}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black ${meta.cls}`}>
                  {meta.label}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MiniBilgi baslik="Teslim portalı" deger={portalUrl} />
                <MiniBilgi baslik="Son güncelleme" deger={tarihSaat(secili.davetiye?.updatedAt ?? secili.kullanilanAt ?? secili.createdAt)} />
                <MiniBilgi baslik="Davetiye" deger={secili.davetiye?.baslik ?? "Henüz oluşturulmadı"} />
                <MiniBilgi baslik="Etkinlik tarihi" deger={tarihKisa(secili.davetiye?.tarih ?? null)} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black text-gray-950">Teslim kapsamı</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <TeslimKalemi label="Dijital davetiye linki" aktif />
                <TeslimKalemi label="Müşteri teslim portalı" aktif />
                <TeslimKalemi label="Genel QR yönlendirmesi" aktif={Boolean(secili.davetiye)} />
                {OZELLIKLER.map(ozellik => (
                  <TeslimKalemi
                    key={ozellik.key}
                    label={ozellik.label}
                    aktif={Boolean(secili.davetiye?.[ozellik.key])}
                  />
                ))}
              </div>
            </div>

            {secili.davetiye && (
              <div className="grid gap-3 sm:grid-cols-3">
                <Sayac label="Görüntülenme" value={secili.davetiye.goruntulenme} />
                <Sayac label="Davetli" value={secili.davetiye.sayilar.davetli} />
                <Sayac label="RSVP" value={secili.davetiye.sayilar.rsvp} />
                <Sayac label="Fotoğraf" value={secili.davetiye.sayilar.foto} />
                <Sayac label="Anı" value={secili.davetiye.sayilar.ani} />
                <Sayac label="Masa" value={secili.davetiye.sayilar.masa} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-950 p-4 text-white shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-black">Müşteriye gönderilecek metin</h3>
                  <p className="mt-1 text-xs text-white/50">Kişisel veri içermez; genel teslim ve kullanım özeti verir.</p>
                </div>
                <button
                  type="button"
                  onClick={kopyala}
                  className="rounded-xl bg-white px-4 py-2 text-xs font-black text-gray-950 transition-colors hover:bg-gray-100"
                >
                  {kopyalandi ? "Kopyalandı" : "Metni kopyala"}
                </button>
              </div>
              <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/75">
                {metin}
              </pre>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(metin)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-green-500 px-4 py-3 text-center text-sm font-black text-white shadow-sm transition-colors hover:bg-green-600"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(`${firmaAdi} teslim raporu`)}&body=${encodeURIComponent(metin)}`}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-black text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                E-posta
              </a>
              <a
                href={davetiyeUrl || portalUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-center text-sm font-black text-purple-700 shadow-sm transition-colors hover:bg-purple-100"
              >
                Aç
              </a>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-semibold leading-relaxed text-amber-800">
              Dashboard içi yönetim linkleri müşteriye gönderilmez. Müşteri için güvenli bağlantı teslim portalı ve yayındaki davetiye linkidir.
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">📋</div>
          <h3 className="text-lg font-black text-gray-950">Henüz raporlanacak teslim yok</h3>
          <p className="mt-2 text-sm text-gray-500">Önce aktivasyon kodu oluşturup müşteriye teslim edin.</p>
        </div>
      )}
    </section>
  );
}

function OzetKart({ baslik, deger }: { baslik: string; deger: string }) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 px-3 py-2 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">{baslik}</p>
      <p className="mt-1 text-xl font-black tabular-nums text-gray-950">{deger}</p>
    </div>
  );
}

function MiniBilgi({ baslik, deger }: { baslik: string; deger: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-100 bg-white px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">{baslik}</p>
      <p className="mt-1 truncate text-xs font-bold text-gray-700">{deger}</p>
    </div>
  );
}

function TeslimKalemi({ label, aktif }: { label: string; aktif: boolean }) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold ${
      aktif ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-400"
    }`}>
      <span className={`h-2 w-2 rounded-full ${aktif ? "bg-emerald-500" : "bg-gray-300"}`} />
      <span>{label}</span>
    </div>
  );
}

function Sayac({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-black tabular-nums text-gray-950">{value}</p>
    </div>
  );
}
