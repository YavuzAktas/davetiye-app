import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SABLONLAR } from "@/lib/sablonlar";

const EMOJILER: Record<string, string> = {
  dugun: "💒", nisan: "💍", dogumgunu: "🎂",
  sunnet: "⭐", kina: "🕯️", kurumsal: "🏢", diger: "🎉",
};

const ETIKETLER: Record<string, string> = {
  dugun: "Düğün", nisan: "Nişan", dogumgunu: "Doğum Günü",
  sunnet: "Sünnet", kina: "Kına", kurumsal: "Kurumsal", diger: "Diğer",
};

export default async function DavetiyelerimSayfasi() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true, name: true, image: true,
      davetiyeler: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true, slug: true, baslik: true, etkinlikTur: true,
          tarih: true, mekan: true, sablon: true, aktif: true,
          goruntulenme: true, odemeDurumu: true,
          _count: { select: { rsvplar: true } },
        },
      },
    },
  });
  if (!user) redirect("/giris");

  const davetiyeIdleri = user.davetiyeler.map(d => d.id);
  const rsvpGruplari = davetiyeIdleri.length > 0
    ? await prisma.rSVP.groupBy({
        by: ["davetiyeId", "katilim"],
        where: { davetiyeId: { in: davetiyeIdleri } },
        _count: { _all: true },
      })
    : [];

  const rsvpSayilari = new Map<string, { katiliyor: number; katilmiyor: number }>();
  for (const grup of rsvpGruplari) {
    const sayilar = rsvpSayilari.get(grup.davetiyeId) ?? { katiliyor: 0, katilmiyor: 0 };
    if (grup.katilim) sayilar.katiliyor = grup._count._all;
    else sayilar.katilmiyor = grup._count._all;
    rsvpSayilari.set(grup.davetiyeId, sayilar);
  }

  const toplamGoruntulenme = user.davetiyeler.reduce((acc, d) => acc + d.goruntulenme, 0);
  const toplamRsvp         = user.davetiyeler.reduce((acc, d) => acc + d._count.rsvplar, 0);
  const toplamKatilim      = [...rsvpSayilari.values()].reduce((acc, s) => acc + s.katiliyor, 0);
  const katilimOrani       = toplamRsvp > 0 ? Math.round((toplamKatilim / toplamRsvp) * 100) : 0;
  const odenmemis          = user.davetiyeler.filter(d => d.odemeDurumu !== "odendi").length;

  const isim = user.name?.split(" ")[0] ?? "Kullanıcı";

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ══ KOYU HERO ══ */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-purple-700/25 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-700/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          {/* Avatar + karşılama + CTA */}
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3.5">
              {user.image ? (
                <Image src={user.image} alt={isim} width={44} height={44}
                  className="w-11 h-11 rounded-2xl ring-2 ring-white/10 object-cover shrink-0" />
              ) : (
                <div className="w-11 h-11 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {isim[0]}
                </div>
              )}
              <div>
                <p className="text-white/35 text-[11px] font-semibold tracking-[0.18em] uppercase mb-0.5">Hoş geldin</p>
                <h1 className="text-white text-xl font-bold leading-none">{isim}</h1>
              </div>
            </div>
            <Link href="/sablonlar"
              className="shrink-0 flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: "0 6px 20px rgba(124,58,237,0.4)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Yeni Davetiye</span>
              <span className="sm:hidden">Yeni</span>
            </Link>
          </div>

          {/* İstatistik kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { etiket: "Davetiye",      deger: user.davetiyeler.length,      alt: `${user.davetiyeler.filter(d => d.aktif && d.odemeDurumu === "odendi").length} yayında`, icon: "📨", from: "from-purple-500/20", to: "to-purple-700/10", border: "border-purple-500/20", accent: "text-purple-300" },
              { etiket: "Görüntülenme",  deger: toplamGoruntulenme,           alt: "toplam ziyaret",                                                                          icon: "👁️", from: "from-blue-500/20",   to: "to-blue-700/10",   border: "border-blue-500/20",   accent: "text-blue-300"   },
              { etiket: "RSVP",          deger: toplamRsvp,                   alt: `${toplamKatilim} katılıyor`,                                                              icon: "✉️", from: "from-amber-500/20",  to: "to-amber-700/10",  border: "border-amber-500/20",  accent: "text-amber-300"  },
              { etiket: "Katılım Oranı", deger: `%${katilimOrani}`,           alt: `${toplamKatilim} / ${toplamRsvp}`,                                                        icon: "✅", from: "from-emerald-500/20",to: "to-emerald-700/10",border: "border-emerald-500/20",accent: "text-emerald-300"},
            ].map(s => (
              <div key={s.etiket} className={`bg-linear-to-br ${s.from} ${s.to} border ${s.border} backdrop-blur-sm rounded-2xl p-4 sm:p-5`}>
                <span className="text-2xl block mb-3">{s.icon}</span>
                <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">{s.deger}</p>
                <p className="text-white/35 text-xs mt-1">{s.etiket}</p>
                <p className={`text-xs mt-0.5 ${s.accent}`}>{s.alt}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* ══ ANA İÇERİK ══ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Sol: Davetiye listesi (2/3) ── */}
          <div className="lg:col-span-2 space-y-5">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Davetiyelerim</h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  {user.davetiyeler.length === 0
                    ? "Henüz davetiye oluşturulmadı"
                    : `${user.davetiyeler.length} davetiye · ${user.davetiyeler.filter(d => d.odemeDurumu === "odendi").length} yayında`}
                </p>
              </div>
              {user.davetiyeler.length > 0 && (
                <Link href="/sablonlar" className="text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors flex items-center gap-1">
                  + Yeni Ekle
                </Link>
              )}
            </div>

            {/* Ödenmemiş uyarısı */}
            {odenmemis > 0 && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5">
                <span className="text-xl shrink-0">⚠️</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-amber-800">{odenmemis} davetiye yayına alınmayı bekliyor</p>
                  <p className="text-xs text-amber-600/80 mt-0.5">Ödemeyi tamamlayın, misafirlerinizle hemen paylaşın.</p>
                </div>
              </div>
            )}

            {/* Boş durum */}
            {user.davetiyeler.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="py-16 px-8 text-center">
                  <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6"
                    style={{ boxShadow: "0 16px 40px rgba(124,58,237,0.25)" }}>
                    🎉
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">İlk davetiyeni oluştur</h3>
                  <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                    30+ hazır şablon arasından seç, dakikalar içinde paylaşmaya hazır.
                  </p>
                  <Link href="/sablonlar"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-purple-700 transition-colors shadow-sm shadow-purple-200">
                    Şablonlara Göz At →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {user.davetiyeler.map(davetiye => {
                  const sablon       = SABLONLAR.find(s => s.id === davetiye.sablon) ?? SABLONLAR[0];
                  const rsvp         = rsvpSayilari.get(davetiye.id) ?? { katiliyor: 0, katilmiyor: 0 };
                  const toplamRsvpD  = davetiye._count.rsvplar;
                  const katilimYuzde = toplamRsvpD > 0 ? Math.round((rsvp.katiliyor / toplamRsvpD) * 100) : 0;
                  const emoji        = EMOJILER[davetiye.etkinlikTur] ?? "🎉";
                  const etiket       = ETIKETLER[davetiye.etkinlikTur] ?? "Etkinlik";
                  const odendi       = davetiye.odemeDurumu === "odendi";

                  return (
                    <div key={davetiye.id}
                      className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">

                      {/* Renkli üst şerit */}
                      <div className="h-1" style={{ background: `linear-gradient(90deg, ${sablon.renk}, ${sablon.renk}66)` }} />

                      <div className="p-5">
                        {/* Başlık */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                            style={{ background: `${sablon.renk}15`, border: `1px solid ${sablon.renk}25` }}>
                            {emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{davetiye.baslik}</h3>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ background: `${sablon.renk}15`, color: sablon.renk }}>
                                {etiket}
                              </span>
                              {odendi ? (
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                                  ✓ Yayında
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded-full">
                                  ⏳ Ödeme Bekliyor
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tarih + mekan */}
                        {(davetiye.tarih || davetiye.mekan) && (
                          <div className="space-y-1 mb-4">
                            {davetiye.tarih && (
                              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                <span className="shrink-0">📅</span>
                                {new Date(davetiye.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                              </p>
                            )}
                            {davetiye.mekan && (
                              <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
                                <span className="shrink-0">📍</span>
                                <span className="truncate">{davetiye.mekan}</span>
                              </p>
                            )}
                          </div>
                        )}

                        {/* RSVP progress */}
                        {odendi && toplamRsvpD > 0 && (
                          <div className="mb-4">
                            <div className="flex justify-between text-[11px] mb-1.5">
                              <span className="text-gray-400">Katılım oranı</span>
                              <span className="font-bold" style={{ color: sablon.renk }}>%{katilimYuzde}</span>
                            </div>
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${katilimYuzde}%`, backgroundColor: sablon.renk }} />
                            </div>
                          </div>
                        )}

                        {/* İstatistikler */}
                        {odendi && (
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <span>👁️</span>
                              <span className="font-semibold text-gray-600">{davetiye.goruntulenme}</span>
                              <span>görüntüleme</span>
                            </div>
                            {toplamRsvpD > 0 && (
                              <>
                                <div className="w-px h-3 bg-gray-200" />
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="font-semibold text-emerald-600">{rsvp.katiliyor}</span>
                                  <span className="text-gray-400">katılıyor</span>
                                </div>
                                <div className="w-px h-3 bg-gray-200" />
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="font-semibold text-red-400">{rsvp.katilmiyor}</span>
                                  <span className="text-gray-400">hayır</span>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Aksiyon butonları */}
                        {odendi ? (
                          <div className="flex gap-2">
                            <Link href={`/davetiye/${davetiye.slug}`} target="_blank"
                              className="flex-1 text-center text-xs border border-gray-200 text-gray-500 px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
                              Önizle ↗
                            </Link>
                            <Link href={`/dashboard/davetiye/${davetiye.slug}`}
                              className="flex-1 text-center text-xs text-white px-3 py-2.5 rounded-xl font-bold transition-all hover:opacity-90"
                              style={{ background: `linear-gradient(135deg, ${sablon.renk}, ${sablon.renk}cc)` }}>
                              Yönet →
                            </Link>
                          </div>
                        ) : (
                          <Link href={`/odeme/${davetiye.slug}`}
                            className="flex items-center justify-center gap-2 w-full text-xs font-bold text-white py-2.5 rounded-xl transition-all hover:opacity-90 bg-amber-500">
                            <span>⚡</span> Ödemeyi Tamamla ve Yayına Al
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Yeni davetiye CTA kartı */}
                <Link href="/sablonlar"
                  className="group bg-white border-2 border-dashed border-gray-200 rounded-3xl p-5 flex flex-col items-center justify-center text-center hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-200 min-h-48">
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-purple-100 rounded-2xl flex items-center justify-center mb-3 transition-all duration-200">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-400 group-hover:text-purple-600 transition-colors">Yeni Davetiye</p>
                  <p className="text-xs text-gray-300 mt-1">Şablondan başla</p>
                </Link>
              </div>
            )}
          </div>

          {/* ── Sağ: Sidebar (1/3) ── */}
          <div className="space-y-4">

            {/* Hızlı oluştur */}
            <div className="bg-white border border-purple-100 rounded-3xl p-5 overflow-hidden relative shadow-sm shadow-purple-50">
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-purple-100 blur-3xl rounded-full pointer-events-none" />
              <div className="relative">
                <div className="text-2xl mb-3">🎨</div>
                <h3 className="text-gray-900 font-bold mb-1">Yeni Davetiye Oluştur</h3>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">30+ şablon, müzik, albüm ve daha fazlası.</p>
                <Link href="/sablonlar"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm shadow-purple-200">
                  Şablonlara Göz At →
                </Link>
              </div>
            </div>

            {/* Hızlı erişim */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Hızlı Erişim</p>
              <div className="space-y-1">
                {[
                  { href: "/sablonlar",               icon: "🎨", label: "Yeni Davetiye",   desc: "Şablondan başla"   },
                  { href: "/dashboard/odeme-gecmisi", icon: "🧾", label: "Ödemelerim",      desc: "Sipariş ve fatura" },
                  { href: "/dashboard/ayarlar",       icon: "⚙️", label: "Hesap Ayarları", desc: "Profil bilgileri"  },
                ].map(link => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 bg-gray-50 group-hover:bg-purple-50 rounded-xl flex items-center justify-center text-sm transition-colors shrink-0">
                      {link.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">{link.label}</p>
                      <p className="text-xs text-gray-400">{link.desc}</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-purple-500 transition-colors text-sm shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
