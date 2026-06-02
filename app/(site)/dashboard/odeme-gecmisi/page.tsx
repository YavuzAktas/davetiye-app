import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SABLONLAR } from "@/lib/sablonlar";
import type { DavetiyeFiyatSonucu } from "@/lib/davetiye-fiyatlandirma";
import { paketGetir } from "@/lib/partner-paketler";

const EMOJILER: Record<string, string> = {
  dugun: "💒", nisan: "💍", dogumgunu: "🎂",
  sunnet: "⭐", kina: "🕯️", kurumsal: "🏢", diger: "🎉",
};

const KALEM_IKONU: Record<string, string> = {
  "temel-davetiye": "✉️",
  "luks-sablon": "✨",
  "muzik": "🎵",
  "album-ani": "📸",
  "sesli-ani": "🎙️",
  "canli-duvar": "🖼️",
  "oturma-plani": "🪑",
};

function formatTutar(paidPrice: string | null, fallback: number | undefined): string {
  const sayi = paidPrice ? parseFloat(paidPrice) : (fallback ?? NaN);
  if (isNaN(sayi)) return "—";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency", currency: "TRY", maximumFractionDigits: 0,
  }).format(sayi);
}

export default async function OdemeGecmisiSayfasi() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/giris");

  const kayitlar = await prisma.odemeKaydi.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      urunTipi: true,
      fiyatKirilimi: true,
      paidPrice: true,
      currency: true,
      paymentStatus: true,
      paymentId: true,
      planId: true,
      aliciAdSoyad: true,
      createdAt: true,
      davetiye: {
        select: {
          slug: true,
          baslik: true,
          etkinlikTur: true,
          sablon: true,
        },
      },
    },
  });

  const toplamHarcama = kayitlar.reduce((acc, k) => {
    const fk = k.fiyatKirilimi as DavetiyeFiyatSonucu | null;
    const sayi = k.paidPrice ? parseFloat(k.paidPrice) : (fk?.toplamTutar ?? 0);
    return acc + (isNaN(sayi) ? 0 : sayi);
  }, 0);

  const toplamHarcamaMetni = new Intl.NumberFormat("tr-TR", {
    style: "currency", currency: "TRY", maximumFractionDigits: 0,
  }).format(toplamHarcama);

  const basariliSayi = kayitlar.filter(k => k.paymentStatus === "SUCCESS").length;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ══ HERO ══ */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-700 opacity-20 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-56 h-56 bg-pink-700 opacity-15 blur-[70px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-2/3 w-40 h-40 bg-indigo-600 opacity-10 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
            <Link href="/dashboard" className="hover:text-white/60 transition-colors">Davetiyelerim</Link>
            <span>/</span>
            <span className="text-white/60">Ödeme Geçmişi</span>
          </div>

          {/* Title + desc */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-purple-500/30 to-pink-500/20 border border-white/10 flex items-center justify-center text-lg">
                🧾
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Ödeme Geçmişi</h1>
            </div>
            <p className="text-white/35 text-sm ml-13">
              Tüm satın alma işlemlerin, fatura bilgilerin ve sipariş detayların.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Toplam Harcama",
                value: toplamHarcamaMetni,
                icon: "💳",
                gradient: "from-purple-500/20 to-purple-600/10",
                border: "border-purple-500/20",
                sub: "tüm zamanlar",
                subColor: "text-purple-300",
              },
              {
                label: "Sipariş Sayısı",
                value: String(kayitlar.length),
                icon: "📄",
                gradient: "from-blue-500/20 to-blue-600/10",
                border: "border-blue-500/20",
                sub: "işlem",
                subColor: "text-blue-300",
              },
              {
                label: "Tamamlanan",
                value: String(basariliSayi),
                icon: "✅",
                gradient: "from-emerald-500/20 to-emerald-600/10",
                border: "border-emerald-500/20",
                sub: "başarılı ödeme",
                subColor: "text-emerald-300",
              },
            ].map(stat => (
              <div key={stat.label} className={`bg-linear-to-br ${stat.gradient} border ${stat.border} backdrop-blur-sm rounded-2xl p-4 sm:p-5`}>
                <span className="text-xl sm:text-2xl mb-2 sm:mb-3 block">{stat.icon}</span>
                <p className="text-xl sm:text-3xl font-bold text-white tabular-nums truncate">{stat.value}</p>
                <p className="text-white/40 text-xs mt-1 hidden sm:block">{stat.label}</p>
                <p className={`text-xs mt-0.5 hidden sm:block ${stat.subColor}`}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* ══ CONTENT ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {kayitlar.length === 0 ? (
          /* ── Empty state ── */
          <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-purple-50/60 to-pink-50/40 pointer-events-none" />
            <div className="relative py-20 px-8 text-center">
              <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-purple-200/50">
                🧾
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz ödeme yok</h3>
              <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                Bir davetiye satın aldığında tüm işlem detayları burada görünecek.
              </p>
              <Link
                href="/sablonlar"
                className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-purple-200 transition-all"
              >
                Davetiye Oluştur →
              </Link>
            </div>
          </div>
        ) : (
          /* ── Payment list ── */
          <div className="space-y-4">
            {kayitlar.map((kayit, idx) => {
              const tarih = new Intl.DateTimeFormat("tr-TR", {
                day: "numeric", month: "long", year: "numeric",
              }).format(new Date(kayit.createdAt));
              const saat = new Intl.DateTimeFormat("tr-TR", {
                hour: "2-digit", minute: "2-digit",
              }).format(new Date(kayit.createdAt));
              const basarili = kayit.paymentStatus === "SUCCESS";

              /* ── Partner paketi özel kartı ── */
              if (kayit.urunTipi === "partner-paket") {
                const fk = kayit.fiyatKirilimi as { paketAd?: string; tutar?: number; hakSayisi?: number } | null;
                const paket = paketGetir(kayit.planId ?? "");
                const paketAd = fk?.paketAd ?? paket?.ad ?? kayit.planId ?? "Partner Paketi";
                const hakSayisi = fk?.hakSayisi ?? paket?.hakSayisi;
                const tutar = formatTutar(kayit.paidPrice, fk?.tutar);

                return (
                  <div
                    key={kayit.id}
                    className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="h-1 bg-linear-to-r from-purple-600 to-pink-500" />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-xl sm:text-2xl shrink-0">🤝</div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{paketAd} — Partner Aboneliği</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{tarih}, {saat}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border shrink-0 ${
                          basarili ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-500 border-gray-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${basarili ? "bg-emerald-500" : "bg-gray-400"}`} />
                          <span className="hidden sm:inline">{basarili ? "Onaylandı" : (kayit.paymentStatus ?? "—")}</span>
                        </span>
                      </div>

                      <div className="bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-purple-900">{paketAd} Paketi</p>
                          {hakSayisi && (
                            <p className="text-xs text-purple-600 mt-0.5">{hakSayisi} aktivasyon hakkı · 1 aylık</p>
                          )}
                        </div>
                        <p className="text-xl font-black text-purple-900 shrink-0">{tutar}</p>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          {kayit.aliciAdSoyad && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-400">
                              <span className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center text-[10px]">👤</span>
                              {kayit.aliciAdSoyad}
                            </span>
                          )}
                          {kayit.paymentId && (
                            <span className="text-xs text-gray-300 font-mono hidden sm:inline">ID: {kayit.paymentId.slice(0, 20)}…</span>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-xs text-gray-300">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          iyzico güvenli ödeme
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              /* ── Davetiye ödeme kartı ── */
              const fk = kayit.fiyatKirilimi as DavetiyeFiyatSonucu | null;
              const davetiye = kayit.davetiye;
              const sablon = davetiye
                ? (SABLONLAR.find(s => s.id === davetiye.sablon) ?? SABLONLAR[0])
                : null;
              const renk = sablon?.renk ?? "#7C3AED";
              const emoji = davetiye ? (EMOJILER[davetiye.etkinlikTur] ?? "🎉") : "📄";
              const baslik = davetiye?.baslik ?? "Silinmiş Davetiye";
              const tutar = formatTutar(kayit.paidPrice, fk?.toplamTutar);

              return (
                <div
                  key={kayit.id}
                  className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Color strip */}
                  <div className="h-1" style={{ background: `linear-gradient(90deg, ${renk}, ${renk}55)` }} />

                  <div className="p-5 sm:p-6">
                    {/* ── Header row ── */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0"
                          style={{ backgroundColor: renk + "15" }}
                        >
                          {emoji}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{baslik}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {sablon?.isim ?? "—"} &middot; {tarih}, {saat}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border ${
                          basarili
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-gray-50 text-gray-500 border-gray-100"
                        }`}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${basarili ? "bg-emerald-500" : "bg-gray-400"}`}
                            style={basarili ? { boxShadow: "0 0 5px #10b981" } : {}}
                          />
                          <span className="hidden sm:inline">{basarili ? "Onaylandı" : (kayit.paymentStatus ?? "—")}</span>
                        </span>

                        {/* Davetiye link */}
                        {davetiye?.slug && (
                          <Link
                            href={`/dashboard/davetiye/${davetiye.slug}`}
                            className="w-8 h-8 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all"
                            title="Davetiyeye git"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* ── Price breakdown ── */}
                    {fk?.kalemler && fk.kalemler.length > 0 && (
                      <div className="bg-gray-50/80 rounded-2xl p-4 mb-4 border border-gray-100">
                        <div className="space-y-2">
                          {fk.kalemler.map(kalem => (
                            <div key={kalem.kod} className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm w-5 text-center">{KALEM_IKONU[kalem.kod] ?? "✦"}</span>
                                <span className="text-sm text-gray-600">{kalem.ad}</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-700">
                                {new Intl.NumberFormat("tr-TR", {
                                  style: "currency", currency: "TRY", maximumFractionDigits: 0,
                                }).format(kalem.tutar)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-600">Toplam ödenen</span>
                          <span className="text-xl font-black text-gray-900">{tutar}</span>
                        </div>
                      </div>
                    )}

                    {/* ── Footer ── */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                        {kayit.aliciAdSoyad && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center text-[10px]">👤</span>
                            {kayit.aliciAdSoyad}
                          </span>
                        )}
                        {kayit.paymentId && (
                          <span className="text-xs text-gray-300 font-mono hidden sm:inline">
                            ID: {kayit.paymentId.slice(0, 20)}…
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-300">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        iyzico güvenli ödeme
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Support note ── */}
        {kayitlar.length > 0 && (
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-5 py-3">
              <span className="text-base">💬</span>
              <p className="text-xs text-gray-500">
                Fatura veya iade talebi için{" "}
                <a
                  href="mailto:destek@davetrota.com"
                  className="text-purple-600 font-medium hover:underline"
                >
                  destek@davetrota.com
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
