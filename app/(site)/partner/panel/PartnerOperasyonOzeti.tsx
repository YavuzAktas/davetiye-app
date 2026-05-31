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

const AKSIYON_DURUMLARI = new Set(["olusturuldu", "gonderildi", "odeme_bekliyor"]);
const KURULUM_DURUMLARI = new Set(["kayit_oldu", "davetiye_olusturuldu"]);

function yuzde(parca: number, toplam: number) {
  if (toplam <= 0) return 0;
  return Math.round((parca / toplam) * 100);
}

function tarihFormatla(tarih: string | null) {
  if (!tarih) return "Süresiz";
  return new Date(tarih).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PartnerOperasyonOzeti({
  firmaAdi,
  abonelik,
  kodlar,
}: {
  firmaAdi: string;
  abonelik: Abonelik;
  kodlar: Kod[];
}) {
  const aktifKodlar = kodlar.filter(k => k.durum !== "iptal");
  const gonderilmeyiBekleyen = aktifKodlar.filter(k => k.durum === "olusturuldu").length;
  const gonderilen = aktifKodlar.filter(k => k.durum === "gonderildi").length;
  const odemeBekleyen = aktifKodlar.filter(k => k.durum === "odeme_bekliyor").length;
  const kurulumda = aktifKodlar.filter(k => KURULUM_DURUMLARI.has(k.durum)).length;
  const yayinda = aktifKodlar.filter(k => k.durum === "yayinda").length;
  const aksiyonBekleyen = aktifKodlar.filter(k => AKSIYON_DURUMLARI.has(k.durum)).length;
  const kalanHak = abonelik ? Math.max(0, abonelik.hakSayisi - abonelik.kullanilanHak) : 0;
  const yayinOrani = yuzde(yayinda, aktifKodlar.length);

  const anaAksiyon = !abonelik
    ? "Partner paketi seçerek müşteri teslim akışını başlatın."
    : kalanHak === 0
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

  const operasyonKartlari = [
    {
      baslik: "Müşteri Teslimi",
      aciklama: "Aktivasyon linkleri ve WhatsApp paylaşım akışı.",
      sayi: gonderilmeyiBekleyen + gonderilen,
      ton: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      baslik: "Kurulumda",
      aciklama: "Müşterinin hesap açtığı ve davetiyeyi hazırladığı süreç.",
      sayi: kurulumda + odemeBekleyen,
      ton: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      baslik: "Etkinlik Günü",
      aciklama: "Yayındaki davetiyeler, QR ve operasyon kullanımı için hazır.",
      sayi: yayinda,
      ton: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-gray-950 via-purple-950 to-gray-950 px-5 py-6 text-white sm:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-200/80">
              Mekan Operasyon Paneli
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              {firmaAdi} için etkinlik teslim akışı
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Partner tarafında yalnızca durum ve toplu operasyon bilgisi görünür; davetli listesi, RSVP yanıtları ve davetiye içeriği müşterinin hesabında kalır.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">Sıradaki İş</p>
            <p className="mt-1 max-w-sm text-sm font-semibold leading-relaxed text-white">{anaAksiyon}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-7">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Kalan Hak</p>
          <p className="mt-2 text-3xl font-black text-gray-900 tabular-nums">{kalanHak}</p>
          <p className="mt-1 text-xs text-gray-500">
            {abonelik ? `${abonelik.hakSayisi} haktan ${abonelik.kullanilanHak} kullanıldı` : "Aktif paket yok"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Aksiyon</p>
          <p className="mt-2 text-3xl font-black text-gray-900 tabular-nums">{aksiyonBekleyen}</p>
          <p className="mt-1 text-xs text-gray-500">Gönderim veya takip bekleyen kod</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Yayında</p>
          <p className="mt-2 text-3xl font-black text-gray-900 tabular-nums">{yayinda}</p>
          <p className="mt-1 text-xs text-gray-500">%{yayinOrani} yayın oranı</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Dönem</p>
          <p className="mt-2 text-xl font-black text-gray-900">{tarihFormatla(abonelik?.bitisAt ?? null)}</p>
          <p className="mt-1 text-xs text-gray-500">Abonelik bitiş tarihi</p>
        </div>
      </div>

      <div className="grid gap-3 border-t border-gray-100 p-5 sm:grid-cols-3 lg:p-7">
        {operasyonKartlari.map(kart => (
          <div key={kart.baslik} className={`rounded-2xl border px-4 py-4 ${kart.ton}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black">{kart.baslik}</p>
                <p className="mt-1 text-xs leading-relaxed opacity-80">{kart.aciklama}</p>
              </div>
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-black tabular-nums">
                {kart.sayi}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-7">
        <p className="text-xs leading-relaxed text-gray-500">
          Kod etiketlerinde kişi adı, telefon veya e-posta tutmayın; salon, tarih aralığı veya iç referans gibi anonim takip bilgileri kullanın.
        </p>
        <a
          href="#aktivasyon-kodlari"
          className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-purple-700 sm:shrink-0"
        >
          Aktivasyonlara Git
        </a>
      </div>
    </section>
  );
}
