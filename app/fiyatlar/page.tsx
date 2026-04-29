"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function PlanSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-7 sm:p-6 lg:p-8 animate-pulse">
      <div className="h-4 w-20 bg-gray-100 rounded mb-4" />
      <div className="h-10 w-24 bg-gray-100 rounded mb-2" />
      <div className="h-3 w-28 bg-gray-100 rounded mb-7" />
      <div className="space-y-3 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}
      </div>
      <div className="h-12 bg-gray-100 rounded-2xl" />
    </div>
  );
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

const PLANLAR = [
  {
    id: "free",
    isim: "Ücretsiz",
    fiyat: 0,
    fiyatLabel: "₺0",
    alt: "",
    aciklama: "Başlamak için ideal",
    ozellikler: ["1 aktif davetiye", "50 davetli", "Temel şablonlar", "RSVP takibi"],
    populer: false,
    buton: "Mevcut Plan",
  },
  {
    id: "standart",
    isim: "Standart",
    fiyat: 299,
    fiyatLabel: "₺299",
    alt: "tek seferlik",
    aciklama: "Bireysel kullanım için",
    ozellikler: ["5 aktif davetiye", "200 davetli", "Tüm şablonlar", "RSVP takibi", "WhatsApp paylaşım", "QR kod"],
    populer: true,
    buton: "Standart'a Geç",
  },
  {
    id: "premium",
    isim: "Premium",
    fiyat: 599,
    fiyatLabel: "₺599",
    alt: "tek seferlik",
    aciklama: "Profesyonel kullanım",
    ozellikler: ["Sınırsız davetiye", "Sınırsız davetli", "Özel tasarım", "Müzik ekleme", "Detaylı analitik", "Öncelikli destek"],
    populer: false,
    buton: "Premium'a Geç",
  },
];

const TABLO = [
  { ozellik: "Aktif davetiye", free: "1", standart: "5", premium: "Sınırsız" },
  { ozellik: "Davetli sayısı", free: "50", standart: "200", premium: "Sınırsız" },
  { ozellik: "Şablonlar", free: "Temel", standart: "Tümü", premium: "Tümü" },
  { ozellik: "RSVP takibi", free: "✓", standart: "✓", premium: "✓" },
  { ozellik: "WhatsApp paylaşım", free: "✓", standart: "✓", premium: "✓" },
  { ozellik: "QR kod", free: "—", standart: "✓", premium: "✓" },
  { ozellik: "Özel renk & font", free: "—", standart: "✓", premium: "✓" },
  { ozellik: "Müzik ekleme", free: "—", standart: "—", premium: "✓" },
  { ozellik: "Detaylı analitik", free: "—", standart: "—", premium: "✓" },
  { ozellik: "Öncelikli destek", free: "—", standart: "—", premium: "✓" },
];

const SSS = [
  { soru: "Ücretsiz plan ne kadar süre kullanılabilir?", cevap: "Ücretsiz plan süresiz kullanılabilir. Daha fazla özellik için istediğiniz zaman yükseltebilirsiniz." },
  { soru: "Ödeme güvenli mi?", cevap: "Tüm ödemeler iyzico altyapısıyla SSL şifreli bağlantı üzerinden işlenir. Kart bilgileriniz güvende." },
  { soru: "İptal edebilir miyim?", cevap: "Tek seferlik ödeme olduğu için abonelik veya otomatik yenileme yoktur. Satın alma sırasında onayladığınız üzere, dijital hizmet satın alma anında başladığından cayma hakkı uygulanmaz. Sorunlar için destek@davetim.com adresine yazabilirsiniz." },
  { soru: "Fatura alabilir miyim?", cevap: "Ödeme belgesi için destek@davetim.com adresine e-posta atmanız yeterlidir; en geç 2 iş günü içinde iletilir." },
];

interface OnayModal {
  planId: string;
  fiyat: number;
  planIsim: string;
  fiyatLabel: string;
}

export default function FiyatlarSayfasi() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState<string | null>(null);
  const [acikSss, setAcikSss] = useState<number | null>(null);
  const [tableRef, tableVisible] = useInView();
  const [sssRef, sssVisible] = useInView();
  const [onayModal, setOnayModal] = useState<OnayModal | null>(null);

  // Plan session'dan direkt okunur — ayrı API isteği gerekmez
  const kullaniciPlan = session?.user?.plan ?? "free";
  const sessionYukleniyor = status === "loading";

  // Ödeme butonuna tıklanınca önce cayma hakkı modalı göster
  const handleOdeme = (planId: string, fiyat: number) => {
    if (!session) { router.push("/giris"); return; }
    if (planId === "free" || kullaniciPlan === planId) return;
    const plan = PLANLAR.find(p => p.id === planId);
    if (!plan) return;
    setOnayModal({ planId, fiyat, planIsim: plan.isim, fiyatLabel: plan.fiyatLabel });
  };

  // Kullanıcı cayma hakkı feragat beyanını onaylayınca API'yi çağır
  const handleOnayliOdeme = async () => {
    if (!onayModal) return;
    const { planId, fiyat } = onayModal;
    setOnayModal(null);
    setYukleniyor(planId);
    try {
      const res = await fetch("/api/odeme/baslat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, fiyat }),
      });
      const data = await res.json();
      if (data.checkoutFormContent) {
        const yeniSayfa = window.open("", "_blank");
        if (yeniSayfa) { yeniSayfa.document.write(data.checkoutFormContent); yeniSayfa.document.close(); }
      }
    } catch { alert("Bir hata oluştu."); }
    finally { setYukleniyor(null); }
  };

  const butonMetni = (planId: string, varsayilan: string) => {
    if (yukleniyor === planId) return "Yükleniyor...";
    if (kullaniciPlan === planId) return "✓ Aktif Planın";
    return varsayilan;
  };

  const planIsmi = (id: string) =>
    id === "free" ? "Ücretsiz" : id === "standart" ? "Standart" : "Premium";

  return (
    <>
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative bg-[#080112] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700 opacity-20 blur-[100px] rounded-full pointer-events-none animate-blob-1" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-700 opacity-15 blur-[80px] rounded-full pointer-events-none animate-blob-2" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Rotating rings */}
        <div className="absolute top-8 right-16 w-32 h-32 border border-purple-500/10 rounded-full animate-spin-slow hidden lg:block" />
        <div className="absolute bottom-12 left-12 w-20 h-20 border border-pink-500/10 rounded-full hidden lg:block"
          style={{ animation: "spin-slow 18s linear infinite reverse" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Şeffaf fiyatlandırma
          </div>

          <h1 className="mb-6">
            <span className="block text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Planlar ve
            </span>
            <span
              className="block text-4xl sm:text-5xl md:text-6xl leading-tight bg-linear-to-r from-purple-400 via-pink-400 to-rose-300 bg-clip-text text-transparent animate-gradient"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              Fiyatlar
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
            İhtiyacınıza uygun planı seçin. Kredi kartı gerekmez, istediğiniz zaman yükseltin.
          </p>

          {status === "authenticated" && (
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 px-4 py-2 rounded-full text-sm text-white/70">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              Mevcut planın:
              <span className="text-white font-semibold">{planIsmi(kullaniciPlan)}</span>
            </div>
          )}
        </div>

        <div className="h-12 bg-linear-to-b from-[#080112] to-white pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════
          PLANLAR
      ══════════════════════════════════════════ */}
      <section className="bg-white pb-16 sm:pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          {sessionYukleniyor ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 lg:gap-5 items-start">
              <PlanSkeleton />
              <div className="sm:-mt-4 sm:mb-4"><PlanSkeleton /></div>
              <PlanSkeleton />
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 lg:gap-5 items-start">
            {PLANLAR.map((plan, i) => {
              const aktif = kullaniciPlan === plan.id;
              const disabled = plan.id === "free" || aktif || yukleniyor === plan.id;

              if (plan.populer) {
                return (
                  <div key={plan.id} className="sm:-mt-4 sm:mb-4 order-first sm:order-0">
                    <div className="relative bg-[#0f0118] rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/40">
                      {/* Inner glow */}
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-700 opacity-20 blur-[60px] rounded-full pointer-events-none" />
                      <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }} />

                      {/* Top badge */}
                      <div className="relative z-10 flex justify-center pt-5">
                        <span className="bg-linear-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide">
                          ✦ EN POPÜLER
                        </span>
                      </div>

                      <div className="relative z-10 p-7 sm:p-6 lg:p-8">
                        <p className="text-purple-300 text-sm font-medium mb-3">{plan.isim}</p>
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-5xl font-bold text-white">{plan.fiyatLabel}</span>
                        </div>
                        <p className="text-purple-400 text-xs mb-1">{plan.alt}</p>
                        <p className="text-purple-300/60 text-sm mb-7">{plan.aciklama}</p>

                        <ul className="space-y-3 mb-8">
                          {plan.ozellikler.map(o => (
                            <li key={o} className="flex items-center gap-3">
                              <span className="w-5 h-5 bg-purple-500/30 border border-purple-500/40 rounded-full flex items-center justify-center text-[10px] text-purple-300 shrink-0">✓</span>
                              <span className="text-sm text-purple-100">{o}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handleOdeme(plan.id, plan.fiyat)}
                          disabled={disabled}
                          className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all ${
                            aktif
                              ? "bg-white/10 text-white/50 cursor-default"
                              : "bg-linear-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 hover:shadow-xl hover:shadow-purple-900/30 hover:-translate-y-0.5 disabled:opacity-50"
                          }`}
                        >
                          {butonMetni(plan.id, plan.buton)}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={plan.id}>
                  <div className={`relative bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    aktif ? "border-purple-300 shadow-lg shadow-purple-100" : "border-gray-100 shadow-sm"
                  }`}>
                    {aktif && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-md">
                          ✓ Aktif Planın
                        </span>
                      </div>
                    )}

                    <div className="p-7 sm:p-6 lg:p-8">
                      <p className={`text-sm font-medium mb-3 ${aktif ? "text-purple-600" : "text-gray-500"}`}>{plan.isim}</p>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className={`text-5xl font-bold ${aktif ? "text-purple-700" : "text-gray-900"}`}>{plan.fiyatLabel}</span>
                      </div>
                      <p className="text-gray-400 text-xs mb-1">{plan.alt}</p>
                      <p className="text-gray-400 text-sm mb-7">{plan.aciklama}</p>

                      <ul className="space-y-3 mb-8">
                        {plan.ozellikler.map(o => (
                          <li key={o} className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                              aktif ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"
                            }`}>✓</span>
                            <span className="text-sm text-gray-600">{o}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleOdeme(plan.id, plan.fiyat)}
                        disabled={disabled}
                        className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                          aktif
                            ? "bg-gray-100 text-gray-400 cursor-default"
                            : plan.id === "free"
                            ? "bg-gray-100 text-gray-400 cursor-default"
                            : "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-50"
                        }`}
                      >
                        {butonMetni(plan.id, plan.buton)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {/* Güven rozetleri */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-12 pt-10 border-t border-gray-100">
            {[
              { icon: "🔒", label: "SSL Şifreli Ödeme" },
              { icon: "✅", label: "iyzico Güvencesi" },
              { icon: "📄", label: "Otomatik Fatura" },
              { icon: "💬", label: "7/24 Destek" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          KARŞILAŞTIRMA TABLOSU
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4" style={{ background: "linear-gradient(180deg, #faf8ff 0%, #fff 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <div
            ref={tableRef}
            className={`text-center mb-12 transition-all duration-700 ${tableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <span className="text-purple-500 text-xs font-bold tracking-[0.25em] uppercase">Detaylı Karşılaştırma</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Plan karşılaştırması</h2>
          </div>

          <div className={`overflow-x-auto rounded-3xl border border-gray-100 shadow-sm transition-all duration-700 delay-150 ${tableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <table className="w-full min-w-130">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-5 text-sm font-medium text-gray-400 w-2/5 bg-white">Özellik</th>
                  {["free", "standart", "premium"].map(id => (
                    <th key={id} className={`px-4 py-5 text-sm font-bold text-center ${
                      kullaniciPlan === id ? "bg-purple-50 text-purple-600" : "bg-white text-gray-700"
                    }`}>
                      {id === "free" ? "Ücretsiz" : id === "standart" ? "Standart" : "Premium"}
                      {kullaniciPlan === id && <span className="ml-1 text-emerald-500">✓</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLO.map((satir, i) => (
                  <tr key={satir.ozellik} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{satir.ozellik}</td>
                    {(["free", "standart", "premium"] as const).map(id => (
                      <td key={id} className={`px-4 py-4 text-sm text-center font-medium ${
                        kullaniciPlan === id ? "bg-purple-50 text-purple-600" : "text-gray-500"
                      } ${satir[id] === "—" ? "text-gray-200" : ""}`}>
                        {satir[id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-gray-300 mt-4 sm:hidden">← Yatay kaydırarak tüm özellikleri görebilirsiniz →</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SSS
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div
            ref={sssRef}
            className={`text-center mb-12 transition-all duration-700 ${sssVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <span className="text-purple-500 text-xs font-bold tracking-[0.25em] uppercase">Merak Edilenler</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Sık sorulan sorular</h2>
          </div>

          <div className="space-y-3">
            {SSS.map((item, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  acikSss === i ? "border-purple-200 shadow-md shadow-purple-50" : "border-gray-100"
                }`}
              >
                <button
                  onClick={() => setAcikSss(acikSss === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">{item.soru}</span>
                  <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-sm transition-all duration-200 ${
                    acikSss === i
                      ? "border-purple-300 bg-purple-50 text-purple-600 rotate-45"
                      : "border-gray-200 text-gray-400"
                  }`}>
                    +
                  </span>
                </button>
                {acikSss === i && (
                  <div className="px-6 pb-5 border-t border-gray-50">
                    <p className="text-gray-500 text-sm leading-relaxed pt-4">{item.cevap}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-800 via-purple-600 to-pink-600 animate-gradient" />
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="text-5xl mb-6">🎉</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Ücretsiz başla,{" "}
            <span style={{ fontFamily: "var(--font-dancing), cursive" }} className="text-pink-200">
              istediğinde yükselt
            </span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg mb-10">
            Kredi kartı gerekmez. Dakikalar içinde ilk davetiyeni oluştur.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sablonlar"
              className="group inline-flex items-center justify-center gap-2.5 bg-white text-purple-700 px-8 py-4 rounded-2xl text-base font-bold hover:bg-purple-50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/30 hover:-translate-y-0.5"
            >
              Ücretsiz Başla
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
            <Link
              href="/sablonlar"
              className="inline-flex items-center justify-center border border-white/20 text-white/80 px-8 py-4 rounded-2xl text-base font-medium hover:bg-white/10 transition-all"
            >
              Şablonlara Bak
            </Link>
          </div>
        </div>
      </section>

    </div>

    {/* ══ Cayma Hakkı Feragat Modalı — Mesafeli Sözleşmeler Yönetmeliği m.15/1-ğ ══ */}
    {onayModal && (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setOnayModal(null)}
      >
        <div
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center text-xl shrink-0">⚖️</div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-snug">Satın Alma Onayı</h3>
              <p className="text-gray-400 text-sm mt-0.5">{onayModal.planIsim} Plan · {onayModal.fiyatLabel}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
            <p className="text-sm text-amber-900 font-semibold mb-2">Cayma Hakkı Hakkında Bilgilendirme</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              6502 sayılı Tüketicinin Korunması Kanunu ve Mesafeli Sözleşmeler Yönetmeliği
              m.15/1-ğ uyarınca; dijital içerik ve hizmetlerde, tüketicinin onayıyla
              ifaya başlandığında <strong>cayma hakkı kullanılamaz.</strong>
            </p>
            <p className="text-xs text-amber-800 leading-relaxed mt-2">
              &quot;Onaylıyorum, Satın Al&quot; butonuna tıklayarak hizmet ifasının{" "}
              <strong>satın alma anında başlamasını</strong> ve bu nedenle 14 günlük
              cayma hakkından feragat ettiğinizi kabul etmiş olursunuz.
            </p>
          </div>

          <p className="text-xs text-gray-400 mb-5">
            Detaylı bilgi için{" "}
            <Link href="/kullanim-sartlari" target="_blank" className="text-purple-600 underline underline-offset-2">
              Kullanım Şartları
            </Link>
            &apos;nı inceleyebilirsiniz.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setOnayModal(null)}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Vazgeç
            </button>
            <button
              onClick={handleOnayliOdeme}
              className="flex-1 py-3 rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Onaylıyorum, Satın Al
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
