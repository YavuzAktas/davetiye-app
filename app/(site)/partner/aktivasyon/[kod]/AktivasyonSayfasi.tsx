"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Durum = "bekliyor" | "isleniyor" | "yonlendiriliyor" | "hata";

const OZELLIK_ETIKETI: Record<string, { isim: string; emoji: string }> = {
  "temel-davetiye": { isim: "Dijital davetiye",      emoji: "💌" },
  "luks-sablon":    { isim: "Lüks şablon seçimi",  emoji: "✨" },
  "muzik":          { isim: "Arka plan müziği",     emoji: "🎵" },
  "album-foto":     { isim: "Fotoğraf albümü",      emoji: "📸" },
  "ani-defteri":    { isim: "Anı defteri",           emoji: "📖" },
  "canli-duvar":    { isim: "Canlı mesaj duvarı",   emoji: "💬" },
  "sesli-ani":      { isim: "Sesli anı kaydı",      emoji: "🎙️" },
  "oturma-plani":   { isim: "Oturma düzeni planı",  emoji: "🪑" },
  "qr-check-in":    { isim: "QR kod check-in",      emoji: "📱" },
  "ani-kitabi-pdf": { isim: "Anı kitabı (PDF)",      emoji: "📚" },
};

const TESLIM_ADIMLARI = [
  {
    sira: "1",
    baslik: "Hesabını aç",
    aciklama: "Bu özel bağlantı davetiye hakkını hesabına tanımlar.",
  },
  {
    sira: "2",
    baslik: "Şablonunu seç",
    aciklama: "Davetiyeni kendi bilgilerinle oluşturur ve yayına alırsın.",
  },
  {
    sira: "3",
    baslik: "Etkinlik araçlarını kullan",
    aciklama: "Pakete dahil QR, albüm, anı ve diğer araçları panelinden yönetirsin.",
  },
];

export default function AktivasyonSayfasi({
  kod,
  firmaAdi,
  logoUrl,
  marka,
  dahilKodlar = [],
}: {
  kod: string;
  firmaAdi: string;
  logoUrl?: string | null;
  marka?: {
    renk?: string | null;
    slogan?: string | null;
    destekTelefonu?: string | null;
    instagramUrl?: string | null;
  };
  dahilKodlar?: string[];
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [durum, setDurum] = useState<Durum>("bekliyor");
  const [hataMesaji, setHataMesaji] = useState("");

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return;
    setDurum("isleniyor");

    fetch(`/api/partner/aktivasyon/${kod}/baglanti`, { method: "POST" })
      .then(async res => {
        if (res.ok) {
          setDurum("yonlendiriliyor");
          router.push(`/sablonlar?aktivasyon=${kod}`);
        } else {
          const d = await res.json().catch(() => ({}));
          setHataMesaji(d.error ?? "Aktivasyon tamamlanamadı.");
          setDurum("hata");
        }
      })
      .catch(() => {
        setHataMesaji("Sunucuya bağlanılamadı, tekrar deneyin.");
        setDurum("hata");
      });
  }, [status, session?.user?.id, kod, router]);

  /* Giriş yapılmamış */
  if (status === "unauthenticated") {
    const gorunenOzellikler = dahilKodlar
      .filter(k => OZELLIK_ETIKETI[k])
      .sort((a, b) => (a === "temel-davetiye" ? -1 : b === "temel-davetiye" ? 1 : 0));
    const markaRenk = marka?.renk || "#7c3aed";

    return (
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="min-w-0">
          <div className="mb-7 flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${firmaAdi} logosu`}
                className="h-12 w-12 rounded-2xl border border-gray-100 bg-white object-contain p-1.5 shadow-sm"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black text-white"
                style={{ backgroundColor: markaRenk }}
              >
                {firmaAdi.slice(0, 1).toLocaleUpperCase("tr-TR")}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-gray-900">{firmaAdi}</p>
              <p className="text-xs font-semibold" style={{ color: markaRenk }}>Müşteri teslim portalı</p>
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
            Size özel etkinlik hakkı
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Dijital davetiyenizi ve etkinlik araçlarınızı buradan başlatın
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">
            Bu bağlantı {firmaAdi} tarafından size tanımlandı. Davetiyenizi kendi hesabınızda oluşturur,
            yasal onayları kendiniz verir ve etkinlik içeriklerinizi yalnızca kendi panelinizden yönetirsiniz.
          </p>
          {marka?.slogan && (
            <p
              className="mt-4 max-w-xl rounded-2xl border px-4 py-3 text-sm font-semibold leading-relaxed"
              style={{ borderColor: `${markaRenk}22`, backgroundColor: `${markaRenk}10`, color: markaRenk }}
            >
              {marka.slogan}
            </p>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {TESLIM_ADIMLARI.map(adim => (
              <div key={adim.sira} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-purple-700 shadow-sm">
                  {adim.sira}
                </span>
                <p className="mt-3 text-sm font-black text-gray-900">{adim.baslik}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{adim.aciklama}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-bold text-emerald-800">Gizlilik notu</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-700">
              Davetli listeniz, RSVP yanıtlarınız, fotoğraflarınız ve anılarınız partner panelinde gösterilmez.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-100 bg-linear-to-br from-purple-50 via-white to-rose-50 p-5 sm:p-6">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-purple-500">
              Dahil Hizmetler
            </p>
            <div className="mt-4 grid gap-2">
              {gorunenOzellikler.map(kod => {
                const o = OZELLIK_ETIKETI[kod]!;
                return (
                  <div key={kod} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-base">
                      {o.emoji}
                    </span>
                    <span className="text-sm font-bold text-gray-800">{o.isim}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => signIn(undefined, { callbackUrl: `/partner/aktivasyon/${kod}` })}
            className="mt-5 w-full rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 px-8 py-4 text-sm font-black text-white transition-opacity hover:opacity-90"
          >
            Hesap Oluştur / Giriş Yap →
          </button>
          <p className="mt-4 text-center text-[11px] leading-relaxed text-gray-400">
            Kayıt olarak{" "}
            <a href="/kullanim-sartlari" className="font-semibold text-purple-500 hover:underline">Kullanım Şartları</a>
            {" "}ve{" "}
            <a href="/gizlilik" className="font-semibold text-purple-500 hover:underline">Gizlilik Politikası</a>
            'nı kabul etmiş olursunuz.
          </p>
          {(marka?.destekTelefonu || marka?.instagramUrl) && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {marka.destekTelefonu && (
                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600 ring-1 ring-gray-100">
                  Destek: {marka.destekTelefonu}
                </span>
              )}
              {marka.instagramUrl && (
                <a
                  href={marka.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600 ring-1 ring-gray-100 hover:text-purple-600"
                >
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* Hata */
  if (durum === "hata") {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">⛔</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Bu Link Kullanılamaz</h1>
        <p className="text-sm text-gray-500 mb-2">{hataMesaji}</p>
        <p className="text-xs text-gray-400">
          Yardım için{" "}
          <a href="mailto:destek@davetrota.com" className="text-purple-600 hover:underline">destek@davetrota.com</a>
        </p>
      </div>
    );
  }

  /* Yükleniyor / yönlendiriliyor */
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto mb-6" />
      <p className="text-sm font-semibold text-gray-600">
        {durum === "yonlendiriliyor" ? "Yönlendiriliyor…" : "Aktivasyon kodu doğrulanıyor…"}
      </p>
    </div>
  );
}
