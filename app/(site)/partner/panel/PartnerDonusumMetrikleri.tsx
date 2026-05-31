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
} | null;

const BASLADI_DURUMLARI = new Set(["kayit_oldu", "odeme_bekliyor", "davetiye_olusturuldu", "yayinda"]);

function yuzde(parca: number, toplam: number) {
  if (toplam <= 0) return 0;
  return Math.round((parca / toplam) * 100);
}

function oranEtiketi(parca: number, toplam: number) {
  return `%${yuzde(parca, toplam)}`;
}

function tarihKisa(tarih: string) {
  return new Date(tarih).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

function son30GunMu(tarih: string) {
  const otuzGunOnce = new Date();
  otuzGunOnce.setDate(otuzGunOnce.getDate() - 30);
  return new Date(tarih) >= otuzGunOnce;
}

function hunilerStili(index: number) {
  const stiller = [
    "border-purple-100 bg-purple-50 text-purple-700",
    "border-blue-100 bg-blue-50 text-blue-700",
    "border-amber-100 bg-amber-50 text-amber-700",
    "border-emerald-100 bg-emerald-50 text-emerald-700",
  ];
  return stiller[index] ?? stiller[0];
}

export default function PartnerDonusumMetrikleri({
  abonelik,
  kodlar,
}: {
  abonelik: Abonelik;
  kodlar: Kod[];
}) {
  const aktifKodlar = kodlar.filter(k => k.durum !== "iptal");
  const son30GunKodlari = aktifKodlar.filter(k => son30GunMu(k.createdAt));
  const olusturulan = aktifKodlar.length;
  const gonderilen = aktifKodlar.filter(k => k.durum !== "olusturuldu").length;
  const baslayan = aktifKodlar.filter(k => BASLADI_DURUMLARI.has(k.durum)).length;
  const yayinda = aktifKodlar.filter(k => k.durum === "yayinda").length;
  const takipBekleyen = aktifKodlar.filter(k => k.durum === "gonderildi").length;
  const odemeBekleyen = aktifKodlar.filter(k => k.durum === "odeme_bekliyor").length;
  const hakKullanim = abonelik ? yuzde(abonelik.kullanilanHak, abonelik.hakSayisi) : 0;
  const son30Yayin = son30GunKodlari.filter(k => k.durum === "yayinda").length;
  const son30Baslayan = son30GunKodlari.filter(k => BASLADI_DURUMLARI.has(k.durum)).length;
  const sonAktiviteler = aktifKodlar
    .filter(k => k.kullanilanAt || k.durum === "yayinda")
    .sort((a, b) => new Date(b.kullanilanAt ?? b.createdAt).getTime() - new Date(a.kullanilanAt ?? a.createdAt).getTime())
    .slice(0, 3);

  const huni = [
    {
      baslik: "Link oluşturuldu",
      sayi: olusturulan,
      oran: olusturulan > 0 ? "%100" : "%0",
      aciklama: "Toplam aktif aktivasyon",
    },
    {
      baslik: "Müşteriye iletildi",
      sayi: gonderilen,
      oran: oranEtiketi(gonderilen, olusturulan),
      aciklama: "Gönderildi veya kullanıldı",
    },
    {
      baslik: "Müşteri başladı",
      sayi: baslayan,
      oran: oranEtiketi(baslayan, gonderilen || olusturulan),
      aciklama: "Kayıt, kurulum veya ödeme aşaması",
    },
    {
      baslik: "Yayına döndü",
      sayi: yayinda,
      oran: oranEtiketi(yayinda, olusturulan),
      aciklama: "Canlı davetiye teslimi",
    },
  ];

  const uyarilar = [
    takipBekleyen > 0
      ? `${takipBekleyen} müşteri link aldı ama henüz başlamadı. Kısa bir hatırlatma dönüşümü artırır.`
      : "Link gönderim sonrası bekleyen müşteri yok.",
    odemeBekleyen > 0
      ? `${odemeBekleyen} müşteri ek özellik/ödeme aşamasında bekliyor.`
      : "Ek özellik ödeme bekleyen müşteri görünmüyor.",
    abonelik && hakKullanim >= 80
      ? `Hak kullanımınız %${hakKullanim}. Yeni müşteri almadan önce paket yenileme planı yapın.`
      : "Hak kullanımı sağlıklı seviyede.",
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
              Dönüşüm ve Değer
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Aktivasyonlar satışa dönüşüyor mu?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Kişisel veri göstermeden, aktivasyon sürecinin ticari performansını takip edin.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Son 30 Gün</p>
            <p className="mt-1 text-sm font-black text-gray-900">
              {son30Baslayan} başlangıç · {son30Yayin} yayın
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5 lg:grid-cols-4 lg:p-7">
        {huni.map((adim, index) => (
          <div key={adim.baslik} className={`rounded-2xl border p-4 ${hunilerStili(index)}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black">{adim.baslik}</p>
                <p className="mt-1 text-xs leading-relaxed opacity-80">{adim.aciklama}</p>
              </div>
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-black">
                {adim.oran}
              </span>
            </div>
            <p className="mt-4 text-3xl font-black tabular-nums">{adim.sayi}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-current transition-all"
                style={{ width: `${adim.baslik === "Link oluşturuldu" && adim.sayi > 0 ? 100 : yuzde(adim.sayi, olusturulan)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 border-t border-gray-100 bg-gray-50 p-5 lg:grid-cols-[1fr_0.85fr] lg:p-7">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black text-gray-950">Dönüşümü artıracak aksiyonlar</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Sayılar düşükse ilk kontrol edilecek yerler.
              </p>
            </div>
            <a
              href="#aktivasyon-kodlari"
              className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-purple-700 sm:shrink-0"
            >
              Kodları Yönet
            </a>
          </div>
          <div className="mt-4 space-y-2">
            {uyarilar.map((uyari, index) => (
              <div key={uyari} className="flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black text-purple-700 ring-1 ring-purple-100">
                  {index + 1}
                </span>
                <p className="text-xs font-semibold leading-relaxed text-gray-700">{uyari}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-sm font-black text-gray-950">Son müşteri hareketleri</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Kişisel bilgi olmadan, sadece kod etiketi ve durum görünür.
          </p>
          <div className="mt-4 space-y-2">
            {sonAktiviteler.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center">
                <p className="text-sm font-semibold text-gray-700">Henüz hareket yok</p>
                <p className="mt-1 text-xs text-gray-400">Müşteri linki kullandığında burada görünür.</p>
              </div>
            )}
            {sonAktiviteler.map(kod => (
              <div key={kod.id} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-gray-900">
                    {kod.not?.trim() || `Kod ${kod.kod.slice(0, 6)}`}
                  </p>
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
        </div>
      </div>
    </section>
  );
}
