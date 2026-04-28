import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SABLONLAR } from "@/lib/sablonlar";
import { PLAN_LIMITLER, PlanTipi } from "@/lib/planlar";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      davetiyeler: {
        orderBy: { createdAt: "desc" },
        include: { rsvplar: true },
      },
    },
  });
  if (!user) redirect("/giris");

  const planLimiti = PLAN_LIMITLER[user.plan as PlanTipi] ?? PLAN_LIMITLER.free;
  const aktifDavetiyeSayisi = user.davetiyeler.filter(d => d.aktif).length;
  const kullanim = planLimiti.davetiyeLimit === 999
    ? 0
    : Math.round((aktifDavetiyeSayisi / planLimiti.davetiyeLimit) * 100);

  const toplamGoruntulenme = user.davetiyeler.reduce((acc, d) => acc + d.goruntulenme, 0);
  const toplamRsvp        = user.davetiyeler.reduce((acc, d) => acc + d.rsvplar.length, 0);
  const toplamKatilim     = user.davetiyeler.reduce((acc, d) => acc + d.rsvplar.filter(r => r.katilim).length, 0);
  const katilimOrani      = toplamRsvp > 0 ? Math.round((toplamKatilim / toplamRsvp) * 100) : 0;

  const EMOJILER: Record<string, string> = {
    dugun: "💍", nisan: "💑", dogumgunu: "🎂",
    sunnet: "⭐", kina: "🌿", kurumsal: "🎯", diger: "🎉",
  };

  const isim = user.name?.split(" ")[0] ?? "Kullanıcı";
  const avatar = user.image;

  const planRenk = user.plan === "premium"
    ? { from: "from-amber-500", to: "to-orange-500", light: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" }
    : user.plan === "standart"
    ? { from: "from-purple-600", to: "to-pink-600", light: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" }
    : { from: "from-gray-700", to: "to-gray-600", light: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ══════════════════════════════════════════
          KOYU HERO HEADER
      ══════════════════════════════════════════ */}
      <div className="relative bg-[#080112] overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-purple-700 opacity-20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-700 opacity-15 blur-[80px] rounded-full pointer-events-none" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20">
          {/* Top row */}
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              {avatar ? (
                <img src={avatar} alt={isim} className="w-12 h-12 rounded-2xl ring-2 ring-white/10 object-cover" />
              ) : (
                <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                  {isim[0]}
                </div>
              )}
              <div>
                <p className="text-white/40 text-xs tracking-[0.15em] uppercase mb-0.5">Hoş geldin</p>
                <h1 className="text-white text-xl sm:text-2xl font-bold leading-none">
                  {isim}
                  {user.plan === "premium" && <span className="ml-2 text-base">👑</span>}
                  {user.plan === "standart" && <span className="ml-2 text-base">⭐</span>}
                </h1>
              </div>
            </div>
            <Link
              href="/sablonlar"
              className="shrink-0 flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-purple-900/30 hover:-translate-y-0.5 transition-all"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">Yeni Davetiye</span>
              <span className="sm:hidden">Yeni</span>
            </Link>
          </div>

          {/* Stat cards — float out of the dark section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                etiket: "Toplam Davetiye",
                deger: user.davetiyeler.length,
                alt: `${aktifDavetiyeSayisi} aktif`,
                icon: "📨",
                gradient: "from-purple-500/20 to-purple-600/10",
                border: "border-purple-500/20",
                textColor: "text-purple-300",
              },
              {
                etiket: "Görüntülenme",
                deger: toplamGoruntulenme,
                alt: "toplam",
                icon: "👁️",
                gradient: "from-blue-500/20 to-blue-600/10",
                border: "border-blue-500/20",
                textColor: "text-blue-300",
              },
              {
                etiket: "RSVP",
                deger: toplamRsvp,
                alt: `${toplamKatilim} katılım`,
                icon: "✉️",
                gradient: "from-amber-500/20 to-amber-600/10",
                border: "border-amber-500/20",
                textColor: "text-amber-300",
              },
              {
                etiket: "Katılım Oranı",
                deger: `%${katilimOrani}`,
                alt: `${toplamKatilim} / ${toplamRsvp}`,
                icon: "✅",
                gradient: "from-emerald-500/20 to-emerald-600/10",
                border: "border-emerald-500/20",
                textColor: "text-emerald-300",
              },
            ].map(stat => (
              <div
                key={stat.etiket}
                className={`bg-linear-to-br ${stat.gradient} border ${stat.border} backdrop-blur-sm rounded-2xl p-4 sm:p-5`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className={`text-2xl sm:text-3xl font-bold text-white tabular-nums`}>{stat.deger}</p>
                <p className="text-white/40 text-xs mt-1">{stat.etiket}</p>
                <p className={`text-xs mt-0.5 ${stat.textColor}`}>{stat.alt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sol — Davetiyeler (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Başlık */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Davetiyelerim</h2>
                <p className="text-sm text-gray-400 mt-0.5">{user.davetiyeler.length} davetiye oluşturuldu</p>
              </div>
              {user.davetiyeler.length > 0 && (
                <Link href="/sablonlar"
                  className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center gap-1">
                  + Yeni Ekle
                </Link>
              )}
            </div>

            {/* Boş Durum */}
            {user.davetiyeler.length === 0 ? (
              <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-pink-50 opacity-60" />
                <div className="relative py-16 px-8 text-center">
                  <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-purple-200">
                    🎉
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">İlk davetiyeni oluştur</h3>
                  <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
                    30+ hazır şablon arasından seç, dakikalar içinde paylaşmaya hazır.
                  </p>
                  <Link
                    href="/sablonlar"
                    className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-purple-200 transition-all"
                  >
                    Şablonlara Göz At →
                  </Link>
                </div>
              </div>
            ) : (
              /* Davetiye Kartları Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.davetiyeler.map((davetiye) => {
                  const sablon = SABLONLAR.find(s => s.id === davetiye.sablon) || SABLONLAR[0];
                  const katilimSayisi = davetiye.rsvplar.filter(r => r.katilim).length;
                  const katilmiyorSayisi = davetiye.rsvplar.filter(r => !r.katilim).length;
                  const emoji = EMOJILER[davetiye.etkinlikTur] ?? "🎉";
                  const katilimYuzde = davetiye.rsvplar.length > 0
                    ? Math.round((katilimSayisi / davetiye.rsvplar.length) * 100)
                    : 0;

                  return (
                    <div
                      key={davetiye.id}
                      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-black/8 hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Kart üst renk şeridi */}
                      <div
                        className="h-2"
                        style={{ background: `linear-gradient(90deg, ${sablon.renk}, ${sablon.renk}88)` }}
                      />

                      <div className="p-5">
                        {/* Başlık row */}
                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                            style={{ backgroundColor: sablon.renk + "18" }}
                          >
                            {emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base">
                              {davetiye.baslik}
                            </h3>
                            {davetiye.tarih && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                📅 {new Date(davetiye.tarih).toLocaleDateString("tr-TR", {
                                  day: "numeric", month: "long", year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Mekan */}
                        {davetiye.mekan && (
                          <p className="text-xs text-gray-400 mb-4 truncate">
                            📍 {davetiye.mekan}
                          </p>
                        )}

                        {/* RSVP bar */}
                        {davetiye.rsvplar.length > 0 && (
                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-gray-400">Katılım oranı</span>
                              <span className="font-semibold" style={{ color: sablon.renk }}>%{katilimYuzde}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${katilimYuzde}%`, backgroundColor: sablon.renk }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Stat satırı */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span>👁️</span>
                            <span className="font-semibold text-gray-700">{davetiye.goruntulenme}</span>
                          </div>
                          <div className="w-px h-3 bg-gray-200" />
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span>✅</span>
                            <span className="font-semibold text-emerald-600">{katilimSayisi}</span>
                            <span>katılıyor</span>
                          </div>
                          <div className="w-px h-3 bg-gray-200" />
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="font-semibold text-red-400">{katilmiyorSayisi}</span>
                            <span>katılmıyor</span>
                          </div>
                        </div>

                        {/* Butonlar */}
                        <div className="flex gap-2">
                          <Link
                            href={`/davetiye/${davetiye.slug}`}
                            target="_blank"
                            className="flex-1 text-center text-xs border border-gray-200 text-gray-600 px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
                          >
                            Önizle ↗
                          </Link>
                          <Link
                            href={`/dashboard/davetiye/${davetiye.slug}`}
                            className="flex-1 text-center text-xs text-white px-3 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                            style={{ backgroundColor: sablon.renk }}
                          >
                            Yönet →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Yeni davetiye CTA kartı */}
                <Link
                  href="/sablonlar"
                  className="group border-2 border-dashed border-gray-200 rounded-3xl p-5 flex flex-col items-center justify-center text-center hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 min-h-50"
                >
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-purple-100 rounded-2xl flex items-center justify-center text-2xl mb-3 transition-colors">
                    +
                  </div>
                  <p className="text-sm font-semibold text-gray-500 group-hover:text-purple-600 transition-colors">Yeni Davetiye</p>
                  <p className="text-xs text-gray-400 mt-1">Şablondan başla</p>
                </Link>
              </div>
            )}
          </div>

          {/* Sağ — Sidebar (1/3) */}
          <div className="space-y-4">

            {/* Plan Kartı */}
            <div className={`relative rounded-3xl overflow-hidden ${
              user.plan !== "free"
                ? `bg-linear-to-br ${planRenk.from} ${planRenk.to}`
                : "bg-white border border-gray-100"
            }`}>
              {user.plan !== "free" && (
                <>
                  <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }} />
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full" />
                </>
              )}

              <div className="relative p-5 sm:p-6">
                {/* Plan başlık */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-1 ${user.plan === "free" ? "text-gray-400" : "text-white/60"}`}>
                      Planın
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {user.plan === "premium" ? "👑" : user.plan === "standart" ? "⭐" : "🆓"}
                      </span>
                      <p className={`text-lg font-bold ${user.plan === "free" ? "text-gray-800" : "text-white"}`}>
                        {planLimiti.isim}
                      </p>
                    </div>
                  </div>

                  {user.plan === "free" && (
                    <Link href="/fiyatlar"
                      className="text-xs bg-linear-to-r from-purple-600 to-pink-600 text-white px-3.5 py-2 rounded-xl font-bold hover:opacity-90 transition-all shrink-0">
                      Yükselt →
                    </Link>
                  )}
                  {user.plan === "standart" && (
                    <Link href="/fiyatlar"
                      className="text-xs bg-white/20 text-white px-3.5 py-2 rounded-xl font-bold hover:bg-white/30 transition-all border border-white/20 shrink-0">
                      Premium →
                    </Link>
                  )}
                  {user.plan === "premium" && (
                    <span className="text-xs bg-white/20 text-white px-3.5 py-2 rounded-xl font-bold border border-white/20">
                      Aktif 🎉
                    </span>
                  )}
                </div>

                {/* Kullanım çubuğu */}
                {planLimiti.davetiyeLimit !== 999 && (
                  <div className="mb-4">
                    <div className={`w-full h-2 rounded-full mb-1.5 ${user.plan === "free" ? "bg-gray-100" : "bg-white/20"}`}>
                      <div
                        className={`h-2 rounded-full transition-all ${
                          kullanim >= 80 ? "bg-red-500" : user.plan === "free" ? "bg-purple-500" : "bg-white"
                        }`}
                        style={{ width: `${Math.min(kullanim, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <p className={`text-xs ${user.plan === "free" ? "text-gray-400" : "text-white/60"}`}>
                        {aktifDavetiyeSayisi} / {planLimiti.davetiyeLimit} davetiye
                      </p>
                      <p className={`text-xs font-semibold ${
                        kullanim >= 80 ? "text-red-400" : user.plan === "free" ? "text-purple-500" : "text-white/80"
                      }`}>
                        %{kullanim}
                      </p>
                    </div>
                  </div>
                )}

                {/* Özellikler */}
                <div className="space-y-2">
                  {planLimiti.ozellikler.map(o => (
                    <div key={o} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${
                        user.plan === "free" ? "bg-purple-100 text-purple-600" : "bg-white/20 text-white"
                      }`}>✓</div>
                      <span className={`text-xs ${user.plan === "free" ? "text-gray-600" : "text-white/80"}`}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hızlı İstatistikler */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6">
              <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase mb-4">Özet</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-sm">📨</div>
                    <span className="text-sm text-gray-600">Davetiye</span>
                  </div>
                  <span className="font-bold text-gray-900">{user.davetiyeler.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-sm">👁️</div>
                    <span className="text-sm text-gray-600">Görüntülenme</span>
                  </div>
                  <span className="font-bold text-gray-900">{toplamGoruntulenme}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-sm">✅</div>
                    <span className="text-sm text-gray-600">Katılım</span>
                  </div>
                  <span className="font-bold text-emerald-600">{toplamKatilim}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center text-sm">❌</div>
                    <span className="text-sm text-gray-600">Katılamıyor</span>
                  </div>
                  <span className="font-bold text-red-400">{toplamRsvp - toplamKatilim}</span>
                </div>

                {toplamRsvp > 0 && (
                  <>
                    <div className="pt-3 border-t border-gray-50">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">Genel katılım oranı</span>
                        <span className="font-bold text-emerald-600">%{katilimOrani}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"
                          style={{ width: `${katilimOrani}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Hızlı Linkler */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6">
              <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase mb-4">Hızlı Erişim</p>
              <div className="space-y-2">
                {[
                  { href: "/sablonlar", label: "Şablonlara Göz At", icon: "🎨", desc: "Yeni davetiye oluştur" },
                  { href: "/fiyatlar", label: "Planlar", icon: "⭐", desc: "Planını yükselt" },
                  { href: "/dashboard/ayarlar", label: "Ayarlar", icon: "⚙️", desc: "Hesap ve profil" },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-gray-100 group-hover:bg-purple-100 rounded-xl flex items-center justify-center text-lg transition-colors shrink-0">
                      {link.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">{link.label}</p>
                      <p className="text-xs text-gray-400 truncate">{link.desc}</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-purple-400 transition-colors ml-auto text-sm">→</span>
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
