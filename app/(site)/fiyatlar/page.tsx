import Link from "next/link";
import { DAVETIYE_FIYAT_KALEMLERI, tutarMetni } from "@/lib/davetiye-fiyatlandirma";

const EK_OZELLIKLER = [
  DAVETIYE_FIYAT_KALEMLERI.luksSablon,
  DAVETIYE_FIYAT_KALEMLERI.muzik,
  DAVETIYE_FIYAT_KALEMLERI.album,
  DAVETIYE_FIYAT_KALEMLERI.sesliAni,
  DAVETIYE_FIYAT_KALEMLERI.canliDuvar,
  DAVETIYE_FIYAT_KALEMLERI.oturmaPlan,
];

const ORNEKLER = [
  {
    ad: "Sade davetiye",
    aciklama: "Temel davetiye, RSVP ve paylaşım linki",
    kalemler: [DAVETIYE_FIYAT_KALEMLERI.temel],
  },
  {
    ad: "Müzikli lüks davetiye",
    aciklama: "Lüks şablon ve arka plan müziği",
    kalemler: [
      DAVETIYE_FIYAT_KALEMLERI.temel,
      DAVETIYE_FIYAT_KALEMLERI.luksSablon,
      DAVETIYE_FIYAT_KALEMLERI.muzik,
    ],
  },
  {
    ad: "Tam özellikli düğün davetiyesi",
    aciklama: "Albüm, sesli anı, canlı duvar ve oturma planı",
    kalemler: [
      DAVETIYE_FIYAT_KALEMLERI.temel,
      DAVETIYE_FIYAT_KALEMLERI.album,
      DAVETIYE_FIYAT_KALEMLERI.sesliAni,
      DAVETIYE_FIYAT_KALEMLERI.canliDuvar,
      DAVETIYE_FIYAT_KALEMLERI.oturmaPlan,
    ],
  },
];

function toplam(kalemler: { tutar: number }[]) {
  return kalemler.reduce((sonuc, kalem) => sonuc + kalem.tutar, 0);
}

export default function FiyatlarSayfasi() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#080112] px-4 py-20 sm:px-6">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-600/25 blur-[110px]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-purple-300">Davetiye bazlı fiyatlandırma</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Sadece seçtiğiniz davetiye ve özellikler için ödeyin
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            Plan, abonelik veya otomatik yenileme yok. Davetiyenizi hazırlarken toplam tutarı canlı görür,
            ödeme sonrası yalnızca o davetiye için seçtiğiniz özellikleri aktif edersiniz.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/sablonlar" className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-gray-950 transition hover:bg-purple-50">
              Şablon Seç ve Başla
            </Link>
            <Link href="/olustur" className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-bold text-white/85 transition hover:bg-white/10">
              Hemen Oluştur
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-purple-100 bg-linear-to-br from-purple-50 to-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500">Başlangıç</p>
            <h2 className="mt-3 text-2xl font-black text-gray-950">Temel dijital davetiye</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Mobil uyumlu davetiye, paylaşım linki, RSVP formu ve yönetim paneli dahildir.
            </p>
            <p className="mt-6 text-4xl font-black text-gray-950">{tutarMetni(DAVETIYE_FIYAT_KALEMLERI.temel.tutar)}</p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-950 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">Nasıl çalışır?</p>
            <div className="mt-5 space-y-4">
              {["Şablonu seçin", "Ek özellikleri açın", "Toplam tutarı görün", "Ödeme sonrası davetiye yayına alınsın"].map((adim, index) => (
                <div key={adim} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-purple-200">{index + 1}</span>
                  <span className="text-sm text-white/75">{adim}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500">Ek özellikler</p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">İhtiyacınız kadar ekleyin</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EK_OZELLIKLER.map(kalem => (
              <div key={kalem.kod} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-900">{kalem.ad}</p>
                <p className="mt-3 text-2xl font-black text-purple-600">{tutarMetni(kalem.tutar)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500">Örnek toplamlar</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {ORNEKLER.map(ornek => (
              <div key={ornek.ad} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-gray-950">{ornek.ad}</h3>
                <p className="mt-1 min-h-10 text-sm leading-6 text-gray-500">{ornek.aciklama}</p>
                <div className="mt-4 space-y-2">
                  {ornek.kalemler.map(kalem => (
                    <div key={kalem.kod} className="flex justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs">
                      <span className="font-medium text-gray-600">{kalem.ad}</span>
                      <span className="font-bold text-gray-900">{tutarMetni(kalem.tutar)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Toplam</span>
                  <span className="text-2xl font-black text-gray-950">{tutarMetni(toplam(ornek.kalemler))}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="text-xl font-black text-gray-950">Ödeme güvenliği</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Ödemeler iyzico altyapısıyla işlenir. Kart bilgileriniz Bekleriz tarafından saklanmaz.
            Dijital hizmet ödeme sonrası başlatılır; ödeme öncesinde ön bilgilendirme, mesafeli satış sözleşmesi
            ve cayma hakkı istisnası ayrıca onaylatılır.
          </p>
        </div>
      </section>
    </main>
  );
}
