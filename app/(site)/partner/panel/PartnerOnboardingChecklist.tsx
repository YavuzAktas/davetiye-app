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

type Marka = {
  logoUrl: string | null;
  markaSlogani: string | null;
  destekTelefonu: string | null;
  instagramUrl: string | null;
  whatsappImzasi: string | null;
};

function yuzde(parca: number, toplam: number) {
  if (toplam <= 0) return 0;
  return Math.round((parca / toplam) * 100);
}

export default function PartnerOnboardingChecklist({
  abonelik,
  kodlar,
  marka,
  teklifHazir,
}: {
  abonelik: Abonelik;
  kodlar: Kod[];
  marka: Marka;
  teklifHazir: boolean;
}) {
  const aktifKodlar = kodlar.filter(k => k.durum !== "iptal");
  const markaTamam = Boolean(
    marka.logoUrl ||
    marka.markaSlogani?.trim() ||
    marka.destekTelefonu?.trim() ||
    marka.instagramUrl?.trim() ||
    marka.whatsappImzasi?.trim()
  );
  const ilkKodVar = aktifKodlar.length > 0;
  const gonderilenVar = aktifKodlar.some(k => k.durum !== "olusturuldu");
  const baslayanVar = aktifKodlar.some(k =>
    ["kayit_oldu", "odeme_bekliyor", "davetiye_olusturuldu", "yayinda"].includes(k.durum)
  );
  const yayindaVar = aktifKodlar.some(k => k.durum === "yayinda");

  const adimlar = [
    {
      baslik: "Aktif partner paketini hazırla",
      aciklama: "Müşteriye link verebilmek için aktif paket gerekir.",
      tamam: Boolean(abonelik),
      href: "#odeme",
      cta: abonelik ? "Paket aktif" : "Paket seç",
    },
    {
      baslik: "Marka görünümünü tamamla",
      aciklama: "Logo, slogan ve destek bilgisi güven verir.",
      tamam: markaTamam,
      href: "#marka",
      cta: markaTamam ? "Marka hazır" : "Markayı düzenle",
    },
    {
      baslik: "İlk teklif metnini hazırla",
      aciklama: "Paketi müşteriye kısa ve net anlatın.",
      tamam: teklifHazir,
      href: abonelik ? "#teklif" : "#odeme",
      cta: teklifHazir ? "Teklif hazır" : abonelik ? "Teklife git" : "Paket seç",
    },
    {
      baslik: "İlk aktivasyon linkini oluştur",
      aciklama: "Müşteriye özel tek kullanımlık link üretin.",
      tamam: ilkKodVar,
      href: abonelik ? "#aktivasyon-kodlari" : "#odeme",
      cta: ilkKodVar ? "Link hazır" : abonelik ? "Link oluştur" : "Paket seç",
    },
    {
      baslik: "Teslim paketini müşteriye gönder",
      aciklama: "Linki ve kullanım notunu müşteriye iletin.",
      tamam: gonderilenVar,
      href: abonelik ? "#aktivasyon-kodlari" : "#odeme",
      cta: gonderilenVar ? "Gönderildi" : abonelik ? "Teslim paketini aç" : "Paket seç",
    },
    {
      baslik: "İlk yayına çıkan işi takip et",
      aciklama: "Yayındaki iş için QR ve ekip kontrolü yapın.",
      tamam: yayindaVar,
      href: abonelik ? "#operasyon" : "#odeme",
      cta: yayindaVar ? "Yayın var" : abonelik ? "Operasyona bak" : "Paket seç",
    },
  ];

  const tamamlanan = adimlar.filter(adim => adim.tamam).length;
  const tamamlanma = yuzde(tamamlanan, adimlar.length);
  const kurulumTamamlandi = tamamlanan === adimlar.length;
  const siradaki = adimlar.find(adim => !adim.tamam) ?? adimlar[adimlar.length - 1];

  if (kurulumTamamlandi) {
    return (
      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="grid gap-4 bg-emerald-50 px-5 py-5 sm:px-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              İlk Kurulum Tamamlandı
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950">
              Panel satış ve teslim için hazır
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-800/75">
              Marka, teklif ve teslim adımları hazır. Günlük işlerde satış ve teslim durumlarını takip edin.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm lg:min-w-56">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-gray-500">Tamamlanma</p>
              <span className="text-sm font-black text-emerald-700">%100</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-emerald-500" />
            </div>
            <p className="mt-2 text-xs font-semibold text-gray-500">
              {tamamlanan}/{adimlar.length} adım tamamlandı
            </p>
          </div>
        </div>

        <details className="group border-t border-emerald-100 bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50 sm:px-7">
            Kurulum adımlarını göster
            <span className="text-xs text-gray-400 transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2 sm:px-7">
            {adimlar.map(adim => (
              <a
                key={adim.baslik}
                href={adim.href}
                className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800 transition-colors hover:bg-emerald-100"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-black">{adim.baslik}</p>
                    <p className="mt-1 text-xs leading-relaxed opacity-75">{adim.aciklama}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </details>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-purple-50 via-white to-rose-50 px-5 py-5 sm:px-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
              İlk Kurulum
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Partner panelini satışa hazır hale getir
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              İlk müşteriyi sorunsuz teslim etmek için bu adımları tamamlayın.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white px-4 py-3 shadow-sm lg:min-w-64">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-gray-500">Tamamlanma</p>
              <span className="text-sm font-black text-purple-700">%{tamamlanma}</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-purple-600 to-pink-500 transition-all"
                style={{ width: `${tamamlanma}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-gray-500">
              {tamamlanan}/{adimlar.length} adım tamamlandı
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr] lg:p-7">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-black text-gray-950">Sıradaki en iyi aksiyon</p>
          <p className="mt-2 text-lg font-black text-purple-700">{siradaki.baslik}</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">{siradaki.aciklama}</p>
          <a
            href={siradaki.href}
            className="mt-4 inline-flex rounded-xl bg-purple-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700"
          >
            {siradaki.cta}
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {adimlar.map((adim, index) => (
            <a
              key={adim.baslik}
              href={adim.href}
              className={`rounded-2xl border p-4 transition-colors ${
                adim.tamam
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                  : "border-gray-100 bg-white text-gray-700 hover:border-purple-100 hover:bg-purple-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  adim.tamam ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {adim.tamam ? "✓" : index + 1}
                </span>
                <div>
                  <p className="text-sm font-black">{adim.baslik}</p>
                  <p className="mt-1 text-xs leading-relaxed opacity-75">{adim.aciklama}</p>
                  <p className="mt-3 text-[11px] font-black uppercase tracking-[0.14em] opacity-60">
                    {adim.cta}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
