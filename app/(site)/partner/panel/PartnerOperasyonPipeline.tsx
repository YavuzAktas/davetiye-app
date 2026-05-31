type Kod = {
  id: string;
  kod: string;
  durum: string;
  createdAt: string;
  kullanilanAt: string | null;
  not: string | null;
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

const DURUM_BASLIK: Record<string, string> = {
  olusturuldu: "Link gönderilecek",
  gonderildi: "Müşteri takibi",
  kayit_oldu: "Kurulum başladı",
  odeme_bekliyor: "Ödeme/özellik bekliyor",
  davetiye_olusturuldu: "Yayın hazırlığı",
  yayinda: "Etkinlik günü hazır",
  iptal: "İptal edildi",
};

const PIPELINE = [
  {
    key: "teslim",
    baslik: "Teslim",
    aciklama: "Link oluşturuldu, müşteriye gönderilecek.",
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
    aciklama: "Etkinlik günü materyalleri hazırlanabilir.",
    durumlar: ["yayinda"],
    renk: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
] as const;

function gunEkle(tarih: Date, gun: number) {
  const yeni = new Date(tarih);
  yeni.setDate(yeni.getDate() + gun);
  return yeni;
}

function tarihFormatla(tarih: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
  }).format(tarih);
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
    return {
      id: kod.id,
      baslik: "Aktivasyon linkini müşteriye gönder",
      aciklama: "WhatsApp mesaj şablonunu kullanarak teslim linkini paylaşın.",
      durum: kod.durum,
      etiket,
      tarih: createdAt,
      oncelik: gunFarki(createdAt) <= 0 ? "bugun" : "normal",
    };
  }

  if (kod.durum === "gonderildi") {
    const takipTarihi = gunEkle(createdAt, 2);
    const gecikti = gunFarki(takipTarihi) < 0;
    return {
      id: kod.id,
      baslik: gecikti ? "Müşteriye dönüş hatırlatması yap" : "Müşteri dönüşünü takip et",
      aciklama: "Link gönderildi; kayıt oluşmadıysa kısa bir WhatsApp hatırlatması faydalı olur.",
      durum: kod.durum,
      etiket,
      tarih: takipTarihi,
      oncelik: gecikti ? "kritik" : "normal",
    };
  }

  if (kod.durum === "odeme_bekliyor") {
    return {
      id: kod.id,
      baslik: "Paket dışı özellik/ödeme bekliyor",
      aciklama: "Müşteri davetiye kurulumunda; ek özellik seçimi veya ödeme bekleniyor.",
      durum: kod.durum,
      etiket,
      tarih: kullanilanAt ?? createdAt,
      oncelik: "kritik",
    };
  }

  if (kod.durum === "kayit_oldu" || kod.durum === "davetiye_olusturuldu") {
    const takipTarihi = gunEkle(kullanilanAt ?? createdAt, 1);
    return {
      id: kod.id,
      baslik: "Kurulum ilerlemesini kontrol et",
      aciklama: "Müşteri hesabını açtı; davetiyenin yayına alınıp alınmadığını takip edin.",
      durum: kod.durum,
      etiket,
      tarih: takipTarihi,
      oncelik: gunFarki(takipTarihi) <= 0 ? "bugun" : "normal",
    };
  }

  if (kod.durum === "yayinda") {
    return {
      id: kod.id,
      baslik: "Etkinlik günü kitini hatırlat",
      aciklama: "Müşteriye QR kiti, check-in ve canlı duvar materyallerini hazırlamasını hatırlatabilirsiniz.",
      durum: kod.durum,
      etiket,
      tarih: kullanilanAt ?? createdAt,
      oncelik: "tamam",
    };
  }

  return null;
}

function oncelikStili(oncelik: OperasyonIs["oncelik"]) {
  if (oncelik === "kritik") return "border-red-100 bg-red-50 text-red-700";
  if (oncelik === "bugun") return "border-amber-100 bg-amber-50 text-amber-700";
  if (oncelik === "tamam") return "border-emerald-100 bg-emerald-50 text-emerald-700";
  return "border-gray-100 bg-gray-50 text-gray-600";
}

export default function PartnerOperasyonPipeline({ kodlar }: { kodlar: Kod[] }) {
  const aktifKodlar = kodlar.filter(k => k.durum !== "iptal");
  const isler = aktifKodlar
    .map(isUret)
    .filter((is): is is OperasyonIs => Boolean(is))
    .sort((a, b) => {
      const oncelikSirasi = { kritik: 0, bugun: 1, normal: 2, tamam: 3 };
      return oncelikSirasi[a.oncelik] - oncelikSirasi[b.oncelik] || a.tarih.getTime() - b.tarih.getTime();
    });
  const odakIsler = isler.filter(is => is.oncelik !== "tamam").slice(0, 5);

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
              Operasyon Pipeline
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Bu hafta takip edilecek işler
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Müşteri verisi göstermeden, aktivasyon durumlarına göre teslim, takip, kurulum ve etkinlik günü hazırlıklarını izleyin.
            </p>
          </div>
          <a
            href="#aktivasyon-kodlari"
            className="inline-flex items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-xs font-black text-purple-700 transition-colors hover:bg-purple-100 lg:shrink-0"
          >
            Kodlara Git
          </a>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-7">
        {PIPELINE.map(kolon => {
          const kolonKodlari = aktifKodlar.filter(k => (kolon.durumlar as readonly string[]).includes(k.durum));
          return (
            <div key={kolon.key} className={`rounded-2xl border px-4 py-4 ${kolon.renk}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black">{kolon.baslik}</p>
                  <p className="mt-1 text-xs leading-relaxed opacity-80">{kolon.aciklama}</p>
                </div>
                <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-black tabular-nums">
                  {kolonKodlari.length}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {kolonKodlari.slice(0, 3).map(kod => (
                  <div key={kod.id} className="rounded-xl bg-white/70 px-3 py-2">
                    <p className="truncate text-xs font-black">{kodEtiketi(kod)}</p>
                    <p className="mt-0.5 text-[11px] opacity-70">{DURUM_BASLIK[kod.durum] ?? kod.durum}</p>
                  </div>
                ))}
                {kolonKodlari.length > 3 && (
                  <p className="text-[11px] font-bold opacity-70">+{kolonKodlari.length - 3} kayıt daha</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-100 bg-gray-50 p-5 lg:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-gray-950">Öncelikli işler</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              En acil takip maddeleri otomatik öne alınır.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-500">
            {odakIsler.length} açık iş
          </span>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {odakIsler.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center lg:col-span-2">
              <p className="text-sm font-semibold text-gray-700">Acil takip işi yok</p>
              <p className="mt-1 text-xs text-gray-400">
                İlk aktivasyon linkini oluşturduğunda takip edilecek işler otomatik olarak burada görünür.
              </p>
              <a
                href="#aktivasyon-kodlari"
                className="mt-4 inline-flex rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-purple-700"
              >
                İlk kodu oluştur
              </a>
            </div>
          )}

          {odakIsler.map(is => (
            <div key={is.id} className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                    {is.etiket}
                  </p>
                  <h3 className="mt-1 text-sm font-black text-gray-950">{is.baslik}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{is.aciklama}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${oncelikStili(is.oncelik)}`}>
                  {zamanEtiketi(is.tarih)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <span className="text-[11px] font-semibold text-gray-400">
                  {DURUM_BASLIK[is.durum] ?? is.durum}
                </span>
                <span className="text-[11px] font-semibold text-gray-400">
                  {tarihFormatla(is.tarih)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
