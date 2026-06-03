type Kod = {
  id: string;
  kod: string;
  durum: string;
  createdAt: string;
  kullanilanAt: string | null;
  not: string | null;
};

type Abonelik = {
  paketId: string;
  hakSayisi: number;
  kullanilanHak: number;
  bitisAt: string | null;
};

type OperasyonIs = {
  id: string;
  baslik: string;
  aciklama: string;
  durum: string;
  etiket: string;
  tarih: Date;
  oncelik: "kritik" | "bugun" | "normal" | "tamam";
};

// ── Sabitler ──────────────────────────────────────────────────────────────────

const AKSIYON_DURUMLARI = new Set(["olusturuldu", "gonderildi", "odeme_bekliyor"]);
const BASLADI_DURUMLARI = new Set(["kayit_oldu", "odeme_bekliyor", "davetiye_olusturuldu", "yayinda"]);

const DURUM_BASLIK: Record<string, string> = {
  olusturuldu: "Link gönderilecek",
  gonderildi: "Müşteri takibi",
  kayit_oldu: "Kurulum başladı",
  odeme_bekliyor: "Ödeme/özellik bekliyor",
  davetiye_olusturuldu: "Yayın hazırlığı",
  yayinda: "Etkinlik günü hazır",
};

const PIPELINE = [
  {
    key: "teslim",
    baslik: "Teslim",
    aciklama: "Link oluşturuldu, gönderilecek.",
    durumlar: ["olusturuldu"],
    renk: "border-purple-100 bg-purple-50 text-purple-700",
  },
  {
    key: "takip",
    baslik: "Takip",
    aciklama: "Link müşteride; dönüş bekleniyor.",
    durumlar: ["gonderildi"],
    renk: "border-blue-100 bg-blue-50 text-blue-700",
  },
  {
    key: "kurulum",
    baslik: "Kurulum",
    aciklama: "Müşteri davetiyeyi hazırlıyor.",
    durumlar: ["kayit_oldu", "odeme_bekliyor", "davetiye_olusturuldu"],
    renk: "border-amber-100 bg-amber-50 text-amber-700",
  },
  {
    key: "hazir",
    baslik: "Yayında",
    aciklama: "Etkinlik günü materyalleri hazır.",
    durumlar: ["yayinda"],
    renk: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
] as const;

// ── Yardımcı fonksiyonlar ─────────────────────────────────────────────────────

function yuzde(parca: number, toplam: number) {
  if (toplam <= 0) return 0;
  return Math.round((parca / toplam) * 100);
}

function tarihKisa(tarih: string | Date) {
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

function tarihUzun(tarih: string | null) {
  if (!tarih) return "Süresiz";
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function son30GunMu(tarih: string) {
  const sinir = new Date();
  sinir.setDate(sinir.getDate() - 30);
  return new Date(tarih) >= sinir;
}

function gunEkle(tarih: Date, gun: number) {
  const yeni = new Date(tarih);
  yeni.setDate(yeni.getDate() + gun);
  return yeni;
}

function gunFarki(tarih: Date) {
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const hedef = new Date(tarih);
  hedef.setHours(0, 0, 0, 0);
  return Math.round((hedef.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));
}

function zamanEtiketi(tarih: Date) {
  const fark = gunFarki(tarih);
  if (fark < 0) return `${Math.abs(fark)} gün gecikti`;
  if (fark === 0) return "Bugün";
  if (fark === 1) return "Yarın";
  return `${fark} gün sonra`;
}

function kodEtiketi(kod: Kod) {
  return kod.not?.trim() || `Kod ${kod.kod.slice(0, 6)}`;
}

function isUret(kod: Kod): OperasyonIs | null {
  if (kod.durum === "iptal") return null;

  const createdAt = new Date(kod.createdAt);
  const kullanilanAt = kod.kullanilanAt ? new Date(kod.kullanilanAt) : null;
  const etiket = kodEtiketi(kod);

  if (kod.durum === "olusturuldu") {
    return { id: kod.id, baslik: "Teslim linkini müşteriye gönder", aciklama: "WhatsApp mesaj şablonunu kullanarak teslim linkini paylaşın.", durum: kod.durum, etiket, tarih: createdAt, oncelik: gunFarki(createdAt) <= 0 ? "bugun" : "normal" };
  }
  if (kod.durum === "gonderildi") {
    const takipTarihi = gunEkle(createdAt, 2);
    const gecikti = gunFarki(takipTarihi) < 0;
    return { id: kod.id, baslik: gecikti ? "Müşteriye dönüş hatırlatması yap" : "Müşteri dönüşünü takip et", aciklama: "Link gönderildi; kayıt oluşmadıysa kısa bir WhatsApp hatırlatması faydalı olur.", durum: kod.durum, etiket, tarih: takipTarihi, oncelik: gecikti ? "kritik" : "normal" };
  }
  if (kod.durum === "odeme_bekliyor") {
    return { id: kod.id, baslik: "Paket dışı özellik/ödeme bekliyor", aciklama: "Müşteri davetiye kurulumunda; ek özellik seçimi veya ödeme bekleniyor.", durum: kod.durum, etiket, tarih: kullanilanAt ?? createdAt, oncelik: "kritik" };
  }
  if (kod.durum === "kayit_oldu" || kod.durum === "davetiye_olusturuldu") {
    const takipTarihi = gunEkle(kullanilanAt ?? createdAt, 1);
    return { id: kod.id, baslik: "Kurulum ilerlemesini kontrol et", aciklama: "Müşteri hesabını açtı; davetiyenin yayına alınıp alınmadığını takip edin.", durum: kod.durum, etiket, tarih: takipTarihi, oncelik: gunFarki(takipTarihi) <= 0 ? "bugun" : "normal" };
  }
  if (kod.durum === "yayinda") {
    return { id: kod.id, baslik: "Etkinlik günü kitini hatırlat", aciklama: "QR kiti, check-in ve canlı duvar materyallerini hazırlamasını hatırlatın.", durum: kod.durum, etiket, tarih: kullanilanAt ?? createdAt, oncelik: "tamam" };
  }
  return null;
}

function oncelikStili(oncelik: OperasyonIs["oncelik"]) {
  if (oncelik === "kritik") return "border-red-100 bg-red-50 text-red-700";
  if (oncelik === "bugun") return "border-amber-100 bg-amber-50 text-amber-700";
  if (oncelik === "tamam") return "border-emerald-100 bg-emerald-50 text-emerald-700";
  return "border-gray-100 bg-gray-50 text-gray-600";
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────

export default function PartnerOperasyonMerkezi({
  firmaAdi,
  abonelik,
  kodlar,
}: {
  firmaAdi: string;
  abonelik: Abonelik;
  kodlar: Kod[];
}) {
  const aktifKodlar = kodlar.filter(k => k.durum !== "iptal");

  // Stat hesaplamaları
  const kalanHak = Math.max(0, abonelik.hakSayisi - abonelik.kullanilanHak);
  const aksiyonBekleyen = aktifKodlar.filter(k => AKSIYON_DURUMLARI.has(k.durum)).length;
  const yayinda = aktifKodlar.filter(k => k.durum === "yayinda").length;
  const gonderilmeyiBekleyen = aktifKodlar.filter(k => k.durum === "olusturuldu").length;
  const odemeBekleyen = aktifKodlar.filter(k => k.durum === "odeme_bekliyor").length;
  const kurulumda = aktifKodlar.filter(k => ["kayit_oldu", "davetiye_olusturuldu"].includes(k.durum)).length;
  const gonderilen = aktifKodlar.filter(k => k.durum !== "olusturuldu").length;
  const baslayan = aktifKodlar.filter(k => BASLADI_DURUMLARI.has(k.durum)).length;
  const yayinOrani = yuzde(yayinda, aktifKodlar.length);

  // Son 30 gün
  const son30Kodlar = aktifKodlar.filter(k => son30GunMu(k.createdAt));
  const son30Baslayan = son30Kodlar.filter(k => BASLADI_DURUMLARI.has(k.durum)).length;
  const son30Yayin = son30Kodlar.filter(k => k.durum === "yayinda").length;

  // Dönüşüm huni (compact)
  const huni = [
    { baslik: "Oluşturuldu", sayi: aktifKodlar.length, oran: 100 },
    { baslik: "İletildi", sayi: gonderilen, oran: yuzde(gonderilen, aktifKodlar.length) },
    { baslik: "Başladı", sayi: baslayan, oran: yuzde(baslayan, aktifKodlar.length) },
    { baslik: "Yayında", sayi: yayinda, oran: yuzde(yayinda, aktifKodlar.length) },
  ];

  // Öncelikli işler
  const isler = aktifKodlar
    .map(isUret)
    .filter((is): is is OperasyonIs => Boolean(is))
    .sort((a, b) => {
      const s = { kritik: 0, bugun: 1, normal: 2, tamam: 3 };
      return s[a.oncelik] - s[b.oncelik] || a.tarih.getTime() - b.tarih.getTime();
    });
  const odakIsler = isler.filter(is => is.oncelik !== "tamam").slice(0, 4);

  // Son aktiviteler
  const sonAktiviteler = aktifKodlar
    .filter(k => k.kullanilanAt || k.durum === "yayinda")
    .sort((a, b) => new Date(b.kullanilanAt ?? b.createdAt).getTime() - new Date(a.kullanilanAt ?? a.createdAt).getTime())
    .slice(0, 4);

  // Sıradaki iş mesajı
  const anaAksiyon =
    kalanHak === 0
      ? "Yeni etkinlik için paket yenileme gerekiyor."
      : gonderilmeyiBekleyen > 0
      ? `${gonderilmeyiBekleyen} teslim linki müşterilere gönderilmeyi bekliyor.`
      : odemeBekleyen > 0
      ? `${odemeBekleyen} etkinlikte ek özellik seçimi veya ödeme bekleniyor.`
      : kurulumda > 0
      ? `${kurulumda} etkinlik müşteri tarafında kurulum aşamasında.`
      : yayinda > 0
      ? `${yayinda} etkinlik yayında; etkinlik günü materyallerini hazır tutun.`
      : "Yeni müşteri için teslim linki oluşturabilirsiniz.";

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

      {/* ── Header: stats + sıradaki iş ── */}
      <div className="border-b border-gray-100 bg-linear-to-br from-purple-50 via-white to-rose-50 px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
              Operasyon Merkezi
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              {firmaAdi} · müşteri akışı
            </h2>
          </div>
          <div className="rounded-2xl border border-purple-100 bg-white px-4 py-3 shadow-sm lg:max-w-xs">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Sıradaki İş</p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-gray-700">{anaAksiyon}</p>
          </div>
        </div>

        {/* 4 stat kartı */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Kalan Hak</p>
            <p className="mt-1.5 text-2xl font-black tabular-nums text-gray-900">{kalanHak}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              {abonelik.hakSayisi} haktan {abonelik.kullanilanHak} kullanıldı
            </p>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Aksiyon</p>
            <p className={`mt-1.5 text-2xl font-black tabular-nums ${aksiyonBekleyen > 0 ? "text-amber-600" : "text-gray-900"}`}>
              {aksiyonBekleyen}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">Gönderim veya takip bekleyen</p>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Yayında</p>
            <p className={`mt-1.5 text-2xl font-black tabular-nums ${yayinda > 0 ? "text-emerald-600" : "text-gray-900"}`}>
              {yayinda}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">%{yayinOrani} yayın oranı</p>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Dönem</p>
            <p className="mt-1.5 text-base font-black text-gray-900">{tarihUzun(abonelik.bitisAt)}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              Son 30 gün: {son30Baslayan} başlangıç · {son30Yayin} yayın
            </p>
          </div>
        </div>
      </div>

      {/* ── Pipeline board ── */}
      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-7">
        {PIPELINE.map(kolon => {
          const kolonKodlari = aktifKodlar.filter(k =>
            (kolon.durumlar as readonly string[]).includes(k.durum)
          );
          return (
            <div key={kolon.key} className={`rounded-2xl border px-4 py-4 ${kolon.renk}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black">{kolon.baslik}</p>
                  <p className="mt-1 text-xs leading-relaxed opacity-75">{kolon.aciklama}</p>
                </div>
                <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-black tabular-nums">
                  {kolonKodlari.length}
                </span>
              </div>
              {kolonKodlari.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {kolonKodlari.slice(0, 3).map(kod => (
                    <div key={kod.id} className="rounded-xl bg-white/70 px-3 py-2">
                      <p className="truncate text-xs font-black">{kodEtiketi(kod)}</p>
                      <p className="mt-0.5 text-[11px] opacity-70">{DURUM_BASLIK[kod.durum] ?? kod.durum}</p>
                    </div>
                  ))}
                  {kolonKodlari.length > 3 && (
                    <p className="text-[11px] font-bold opacity-60">+{kolonKodlari.length - 3} kayıt daha</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Alt: Öncelikli işler (sol) + Dönüşüm + Son aktiviteler (sağ) ── */}
      <div className="grid gap-5 border-t border-gray-100 bg-gray-50 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-7">

        {/* Öncelikli işler */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-gray-950">Öncelikli işler</p>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500">
              {odakIsler.length} açık
            </span>
          </div>

          {odakIsler.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center">
              <p className="text-sm font-semibold text-gray-700">Acil takip işi yok</p>
              <p className="mt-1 text-xs text-gray-400">
                İlk teslim linkini oluşturduğunda işler burada görünür.
              </p>
              <a
                href="#aktivasyon-kodlari"
                className="mt-4 inline-flex rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-purple-700"
              >
                İlk kodu oluştur
              </a>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {odakIsler.map(is => (
                <div key={is.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                        {is.etiket}
                      </p>
                      <p className="mt-0.5 text-sm font-black text-gray-950">{is.baslik}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{is.aciklama}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-black ${oncelikStili(is.oncelik)}`}>
                      {zamanEtiketi(is.tarih)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <a
            href="#aktivasyon-kodlari"
            className="mt-4 flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-purple-700"
          >
            Teslim Linklerini Yönet
          </a>
        </div>

        {/* Dönüşüm özeti + Son aktiviteler */}
        <div className="space-y-4">

          {/* Kompakt huni */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <p className="text-sm font-black text-gray-950">Dönüşüm huni</p>
            <div className="mt-3 space-y-2">
              {huni.map(adim => (
                <div key={adim.baslik} className="flex items-center gap-3">
                  <p className="w-20 shrink-0 text-xs font-semibold text-gray-500">{adim.baslik}</p>
                  <div className="flex-1 overflow-hidden rounded-full bg-gray-100 h-2">
                    <div
                      className="h-full rounded-full bg-purple-500 transition-all"
                      style={{ width: `${adim.oran}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs font-black tabular-nums text-gray-700">
                    {adim.sayi}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Son aktiviteler */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <p className="text-sm font-black text-gray-950">Son hareketler</p>
            {sonAktiviteler.length === 0 ? (
              <div className="mt-3 rounded-xl border border-dashed border-gray-200 px-4 py-5 text-center">
                <p className="text-xs font-semibold text-gray-500">Henüz hareket yok</p>
                <p className="mt-1 text-[11px] text-gray-400">
                  Müşteriye link gönderdiğinde burada görünür.
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-1.5">
                {sonAktiviteler.map(kod => (
                  <div key={kod.id} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-gray-900">{kodEtiketi(kod)}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
                        {kod.durum === "yayinda" ? "Yayına çıktı" : "Müşteri başladı"}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold text-gray-400">
                      {tarihKisa(kod.kullanilanAt ?? kod.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
