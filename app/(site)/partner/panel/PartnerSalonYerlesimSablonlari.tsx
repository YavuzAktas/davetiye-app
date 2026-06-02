"use client";

import { useMemo, useState } from "react";

type SablonId = "klasik" | "aile" | "kokteyl" | "kurumsal";

type Sablon = {
  id: SablonId;
  ad: string;
  etiket: string;
  aciklama: string;
  kullanim: string;
  oncelikliMasalar: string[];
  operasyonNotlari: string[];
};

const SABLONLAR: Sablon[] = [
  {
    id: "klasik",
    ad: "Klasik Düğün Salonu",
    etiket: "En yaygın",
    aciklama: "Gelin-damat, aile ve standart konuk masalarıyla hızlı başlangıç planı.",
    kullanim: "Düğün, nişan ve kına organizasyonları",
    oncelikliMasalar: ["Gelin & Damat", "Aile 1", "Aile 2", "Protokol"],
    operasyonNotlari: [
      "Aile ve protokol masalarını sahneye yakın konumlandırın.",
      "Yaşlı misafirleri hoparlörden uzak, çıkışa yakın bölüme alın.",
      "Çocuklu aileler için servis ve geçiş alanı geniş olan masaları ayırın.",
    ],
  },
  {
    id: "aile",
    ad: "Aile Ağırlıklı Yerleşim",
    etiket: "Yakın çevre",
    aciklama: "Akraba gruplarının ayrılmadan oturması gereken etkinlikler için.",
    kullanim: "Kalabalık aileli nişan, söz ve düğünler",
    oncelikliMasalar: ["Birinci Derece Aile", "Yakın Akraba 1", "Yakın Akraba 2", "Arkadaş Grubu"],
    operasyonNotlari: [
      "Aile masalarını aynı servis bölgesinde tutun.",
      "Birbiriyle görüşmesi gereken grupları yan yana planlayın.",
      "Son dakika gelen misafirler için en az bir esnek masa bırakın.",
    ],
  },
  {
    id: "kokteyl",
    ad: "Kokteyl / Ayakta Davet",
    etiket: "Esnek",
    aciklama: "Tam oturma yerine lounge, bistro ve sınırlı oturma düzeni gereken etkinlikler.",
    kullanim: "Kokteyl, lansman, mezuniyet ve kurumsal davetler",
    oncelikliMasalar: ["VIP Bistro", "Aile Oturma", "Lounge 1", "Lounge 2"],
    operasyonNotlari: [
      "Oturma kapasitesini toplam katılımın tamamı yerine çekirdek grup için planlayın.",
      "QR panosunu giriş ve bar/ikram alanı yakınına yerleştirin.",
      "Yaşlı ve çocuklu misafirler için net işaretlenmiş oturma alanı ayırın.",
    ],
  },
  {
    id: "kurumsal",
    ad: "Kurumsal / Protokol",
    etiket: "Resmi",
    aciklama: "Sponsor, yönetim, konuşmacı ve ekip grupları olan etkinlikler için.",
    kullanim: "Kurumsal yemek, lansman, bayi toplantısı ve gala",
    oncelikliMasalar: ["Protokol", "Konuşmacılar", "Sponsorlar", "Ekip"],
    operasyonNotlari: [
      "Protokol masasını sahne, sunum ekranı ve çıkış rotasına göre planlayın.",
      "Konuşmacı ve teknik ekip masalarını hızlı erişim için ayrı tutun.",
      "Yaka kartı veya QR check-in akışıyla giriş listesini eşleştirin.",
    ],
  },
];

function sayiSinirla(deger: number, min: number, max: number) {
  if (Number.isNaN(deger)) return min;
  return Math.min(max, Math.max(min, deger));
}

function masaListesiOlustur(sablon: Sablon, misafirSayisi: number, masaKapasitesi: number, esnekMasa: number) {
  const toplamMasa = Math.ceil(misafirSayisi / masaKapasitesi) + esnekMasa;
  const oncelikli = sablon.oncelikliMasalar.slice(0, Math.min(sablon.oncelikliMasalar.length, toplamMasa));
  const standartAdet = Math.max(0, toplamMasa - oncelikli.length);
  const standart = Array.from({ length: standartAdet }, (_, index) => `Masa ${index + 1}`);

  return [...oncelikli, ...standart].map((isim, index) => ({
    sira: index + 1,
    isim,
    kapasite: masaKapasitesi,
  }));
}

function planMetni({
  sablon,
  misafirSayisi,
  masaKapasitesi,
  esnekMasa,
}: {
  sablon: Sablon;
  misafirSayisi: number;
  masaKapasitesi: number;
  esnekMasa: number;
}) {
  const masalar = masaListesiOlustur(sablon, misafirSayisi, masaKapasitesi, esnekMasa);
  return [
    `${sablon.ad} masa yerleşim taslağı`,
    "",
    `Tahmini misafir sayısı: ${misafirSayisi}`,
    `Masa kapasitesi: ${masaKapasitesi}`,
    `Esnek/yedek masa: ${esnekMasa}`,
    "",
    "Masa listesi:",
    ...masalar.map(masa => `${masa.sira}. ${masa.isim} - ${masa.kapasite} kişi`),
    "",
    "Operasyon notları:",
    ...sablon.operasyonNotlari.map(not => `- ${not}`),
    "",
    "KVKK notu: Davetli isimleri ve özel tercihler müşterinin kendi DavetRota hesabındaki oturma planında yönetilmelidir. Partner tarafında kişisel davetli listesi tutulmamalıdır.",
  ].join("\n");
}

function musteriMesaji({
  firmaAdi,
  sablon,
  misafirSayisi,
  masaKapasitesi,
}: {
  firmaAdi: string;
  sablon: Sablon;
  misafirSayisi: number;
  masaKapasitesi: number;
}) {
  return [
    `Merhaba, ${firmaAdi} olarak etkinliğiniz için ${sablon.ad} yerleşim taslağını öneriyoruz.`,
    "",
    `Yaklaşık ${misafirSayisi} misafir için ${masaKapasitesi} kişilik masa düzeniyle başlayabilirsiniz.`,
    "Davetli isimleri, LCV/RSVP yanıtları ve masa atamaları sizin DavetRota hesabınızda yönetilir.",
    "",
    "Hazırlık için öneriler:",
    "- Aile, protokol ve özel ihtiyaçlı misafir gruplarını önce belirleyin.",
    "- Son dakika değişiklikleri için yedek masa veya boş kapasite bırakın.",
    "- Etkinlikten önce QR kitini ve oturma planını birlikte kontrol edin.",
  ].join("\n");
}

export default function PartnerSalonYerlesimSablonlari({ firmaAdi }: { firmaAdi: string }) {
  const [sablonId, setSablonId] = useState<SablonId>("klasik");
  const [misafirSayisi, setMisafirSayisi] = useState(250);
  const [masaKapasitesi, setMasaKapasitesi] = useState(10);
  const [esnekMasa, setEsnekMasa] = useState(2);
  const [kopyalanan, setKopyalanan] = useState<"plan" | "musteri" | null>(null);

  const sablon = useMemo(() => SABLONLAR.find(item => item.id === sablonId) ?? SABLONLAR[0], [sablonId]);
  const guvenliMisafirSayisi = sayiSinirla(misafirSayisi, 1, 10000);
  const guvenliMasaKapasitesi = sayiSinirla(masaKapasitesi, 1, 50);
  const guvenliEsnekMasa = sayiSinirla(esnekMasa, 0, 20);
  const masalar = useMemo(
    () => masaListesiOlustur(sablon, guvenliMisafirSayisi, guvenliMasaKapasitesi, guvenliEsnekMasa),
    [guvenliEsnekMasa, guvenliMasaKapasitesi, guvenliMisafirSayisi, sablon]
  );
  const toplamKapasite = masalar.reduce((toplam, masa) => toplam + masa.kapasite, 0);
  const doluluk = Math.min(100, Math.round((guvenliMisafirSayisi / toplamKapasite) * 100));
  const plan = useMemo(
    () => planMetni({ sablon, misafirSayisi: guvenliMisafirSayisi, masaKapasitesi: guvenliMasaKapasitesi, esnekMasa: guvenliEsnekMasa }),
    [guvenliEsnekMasa, guvenliMasaKapasitesi, guvenliMisafirSayisi, sablon]
  );
  const mesaj = useMemo(
    () => musteriMesaji({ firmaAdi, sablon, misafirSayisi: guvenliMisafirSayisi, masaKapasitesi: guvenliMasaKapasitesi }),
    [firmaAdi, guvenliMasaKapasitesi, guvenliMisafirSayisi, sablon]
  );

  const kopyala = async (tip: "plan" | "musteri") => {
    try {
      await navigator.clipboard.writeText(tip === "plan" ? plan : mesaj);
      setKopyalanan(tip);
      setTimeout(() => setKopyalanan(null), 2000);
    } catch {
      setKopyalanan(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Salon yerleşim şablonları</p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Masa düzenini tekliften operasyona bağlayın
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Müşteri kabul ettikten sonra başlangıç masa planını, yedek kapasiteyi ve ekip notlarını hızlıca hazırlayın.
              Davetli isimleri müşterinin kendi oturma planında kalır.
            </p>
          </div>
          <a
            href="#aktivasyon-kodlari"
            className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-4 py-3 text-xs font-black text-white transition-colors hover:bg-purple-700"
          >
            Müşteri Linki Oluştur
          </a>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px] lg:p-7">
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {SABLONLAR.map(item => {
              const secili = item.id === sablonId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSablonId(item.id)}
                  className={`rounded-3xl border p-4 text-left transition-colors ${
                    secili
                      ? "border-purple-200 bg-purple-50 ring-2 ring-purple-100"
                      : "border-gray-100 bg-gray-50 hover:border-purple-100 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-gray-950">{item.ad}</p>
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-500">{item.kullanim}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-purple-700 ring-1 ring-purple-100">
                      {item.etiket}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">{item.aciklama}</p>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <span className="text-xs font-bold text-gray-500">Tahmini misafir</span>
              <input
                type="number"
                min={1}
                max={10000}
                value={misafirSayisi}
                onChange={e => setMisafirSayisi(sayiSinirla(Number(e.target.value), 1, 10000))}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-gray-900 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </label>
            <label className="block rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <span className="text-xs font-bold text-gray-500">Masa kapasitesi</span>
              <input
                type="number"
                min={1}
                max={50}
                value={masaKapasitesi}
                onChange={e => setMasaKapasitesi(sayiSinirla(Number(e.target.value), 1, 50))}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-gray-900 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </label>
            <label className="block rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <span className="text-xs font-bold text-gray-500">Yedek masa</span>
              <input
                type="number"
                min={0}
                max={20}
                value={esnekMasa}
                onChange={e => setEsnekMasa(sayiSinirla(Number(e.target.value), 0, 20))}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-gray-900 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </label>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-purple-50 p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white px-4 py-3 text-center">
                <p className="text-2xl font-black text-gray-950 tabular-nums">{masalar.length}</p>
                <p className="mt-0.5 text-[11px] font-bold text-gray-400">Toplam masa</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-center">
                <p className="text-2xl font-black text-gray-950 tabular-nums">{toplamKapasite}</p>
                <p className="mt-0.5 text-[11px] font-bold text-gray-400">Toplam kapasite</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-center">
                <p className={`text-2xl font-black tabular-nums ${doluluk > 92 ? "text-amber-600" : "text-emerald-600"}`}>
                  %{doluluk}
                </p>
                <p className="mt-0.5 text-[11px] font-bold text-gray-400">Plan doluluğu</p>
              </div>
            </div>
            {doluluk > 92 && (
              <p className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-semibold leading-relaxed text-amber-700">
                Doluluk yüksek. Son dakika LCV değişiklikleri için yedek masa veya daha büyük kapasite önerin.
              </p>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Masa taslağı</p>
          <h3 className="mt-2 text-lg font-black text-gray-950">{sablon.ad}</h3>
          <div className="mt-4 max-h-96 space-y-2 overflow-auto pr-1">
            {masalar.map(masa => (
              <div key={`${masa.sira}-${masa.isim}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-gray-900">{masa.isim}</p>
                  <p className="text-[11px] font-semibold text-gray-400">Sıra {masa.sira}</p>
                </div>
                <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-black text-purple-700">
                  {masa.kapasite} kişi
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 p-5 lg:p-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-gray-100 bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-gray-950">Operasyon planı</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Salon ekibi için masa listesi ve yerleşim notları. Kişisel davetli verisi içermez.
                </p>
              </div>
              <button
                type="button"
                onClick={() => kopyala("plan")}
                className="rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-purple-700 sm:shrink-0"
              >
                {kopyalanan === "plan" ? "Kopyalandı" : "Planı Kopyala"}
              </button>
            </div>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-gray-950 p-4 text-xs leading-relaxed text-white/85">
              {plan}
            </pre>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-4">
            <p className="text-sm font-black text-gray-950">Müşteri mesajı</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Müşteriye masa planı hazırlığı için gönderebileceğiniz kısa metin.
            </p>
            <button
              type="button"
              onClick={() => kopyala("musteri")}
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-purple-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700"
            >
              {kopyalanan === "musteri" ? "Kopyalandı" : "Müşteri Metnini Kopyala"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(mesaj)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-black text-white transition-opacity hover:opacity-90"
            >
              WhatsApp'ta Aç
            </a>
            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-black text-amber-800">Hukuksal güvenli kullanım</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-700">
                Partner bu araçta isim listesi tutmaz. Davetli adı, özel ihtiyaç ve masa ataması müşterinin kendi panelinde yapılmalıdır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
