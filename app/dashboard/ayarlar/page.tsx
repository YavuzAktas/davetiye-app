import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PLAN_LIMITLER, PlanTipi } from "@/lib/planlar";
import AyarlarClient from "@/components/AyarlarClient";

export default async function AyarlarSayfasi() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      davetiyeler: {
        include: { rsvplar: true },
      },
    },
  });
  if (!user) redirect("/giris");

  const planLimiti    = PLAN_LIMITLER[user.plan as PlanTipi] ?? PLAN_LIMITLER.free;
  const aktifSayi     = user.davetiyeler.filter(d => d.aktif).length;
  const toplamGorunt  = user.davetiyeler.reduce((a, d) => a + d.goruntulenme, 0);
  const toplamRsvp    = user.davetiyeler.reduce((a, d) => a + d.rsvplar.length, 0);
  const toplamKatilim = user.davetiyeler.reduce((a, d) => a + d.rsvplar.filter(r => r.katilim).length, 0);
  const kullanim      = planLimiti.davetiyeLimit === 999
    ? 100
    : Math.round((aktifSayi / planLimiti.davetiyeLimit) * 100);

  const uyeOlduTarih = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(user.createdAt));

  const planIsim = planLimiti.isim;

  const planConfig = {
    free:     { emoji: "🆓", gradient: "from-gray-500 to-gray-600",     ring: "ring-gray-200",    label: "text-gray-600" },
    standart: { emoji: "⭐", gradient: "from-purple-600 to-pink-600",   ring: "ring-purple-200",  label: "text-purple-600" },
    premium:  { emoji: "👑", gradient: "from-amber-500 to-orange-500",  ring: "ring-amber-200",   label: "text-amber-600" },
  }[user.plan as PlanTipi] ?? { emoji: "🆓", gradient: "from-gray-500 to-gray-600", ring: "ring-gray-200", label: "text-gray-600" };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ══ KOYU HERO HEADER ══ */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-purple-700 opacity-20 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-pink-700 opacity-15 blur-[70px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/30 text-xs mb-8">
            <Link href="/dashboard" className="hover:text-white/60 transition-colors">Dashboard</Link>
            <span>›</span>
            <span className="text-white/50">Ayarlar</span>
          </div>

          {/* Profil hero row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "Profil"}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ${planConfig.ring} ring-offset-2 ring-offset-[#080112]`}
                />
              ) : (
                <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br ${planConfig.gradient} rounded-3xl flex items-center justify-center text-3xl text-white font-bold ring-4 ${planConfig.ring} ring-offset-2 ring-offset-[#080112]`}>
                  {(user.name ?? "U")[0]}
                </div>
              )}
              {/* Plan badge üzerinde */}
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 bg-linear-to-br ${planConfig.gradient} rounded-xl flex items-center justify-center text-sm shadow-lg`}>
                {planConfig.emoji}
              </div>
            </div>

            {/* İsim + meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">
                {user.name ?? "Kullanıcı"}
              </h1>
              <p className="text-white/40 text-sm mb-3 truncate">{user.email}</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className={`inline-flex items-center gap-1.5 bg-linear-to-r ${planConfig.gradient} px-3 py-1.5 rounded-full`}>
                  <span className="text-xs">{planConfig.emoji}</span>
                  <span className="text-white text-xs font-bold">{planIsim} Plan</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/8 border border-white/10 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-white/50 text-xs">Google ile bağlı</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/8 border border-white/10 px-3 py-1.5 rounded-full">
                  <span className="text-white/50 text-xs">📅 {uyeOlduTarih}'den beri üye</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SOL — Statik bilgiler (2/3) */}
          <div className="lg:col-span-2 space-y-5">

            {/* Profil Bilgileri */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase">Profil Bilgileri</p>
                <p className="text-xs text-gray-300 mt-0.5">Google hesabından otomatik alınır</p>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Ad Soyad",       value: user.name ?? "—",   icon: "👤" },
                  { label: "E-posta",         value: user.email,          icon: "✉️" },
                  { label: "Giriş Yöntemi",  value: "Google OAuth 2.0",  icon: "🔐" },
                  { label: "Üyelik Tarihi",  value: uyeOlduTarih,        icon: "📅" },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                      {row.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{row.value}</p>
                    </div>
                    <div className="text-xs text-gray-200 shrink-0">Düzenlenemez</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan & Kullanım */}
            <div className={`relative rounded-3xl overflow-hidden ${
              user.plan === "free"
                ? "bg-white border border-gray-100"
                : user.plan === "standart"
                ? "bg-[#0f0118]"
                : "bg-[#0f0118]"
            }`}>
              {user.plan !== "free" && (
                <>
                  <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 ${
                    user.plan === "premium" ? "bg-amber-500" : "bg-purple-600"
                  }`} />
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }} />
                </>
              )}

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-2 ${user.plan === "free" ? "text-gray-400" : "text-white/40"}`}>
                      Mevcut Plan
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{planConfig.emoji}</span>
                      <div>
                        <h3 className={`text-xl font-bold ${user.plan === "free" ? "text-gray-900" : "text-white"}`}>
                          {planIsim}
                        </h3>
                        <p className={`text-xs ${user.plan === "free" ? "text-gray-400" : "text-white/40"}`}>
                          {user.plan === "premium" ? "Tüm özellikler açık" : user.plan === "standart" ? "Bireysel kullanım" : "Ücretsiz başlangıç"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/fiyatlar"
                    className={`text-sm px-4 py-2 rounded-xl font-bold transition-all shrink-0 ${
                      user.plan === "free"
                        ? "bg-linear-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                        : user.plan === "standart"
                        ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        : "bg-white/10 text-white border border-white/20 cursor-default"
                    }`}
                  >
                    {user.plan === "free" ? "Yükselt →" : user.plan === "standart" ? "Premium →" : "Aktif 🎉"}
                  </Link>
                </div>

                {/* Kullanım çubuğu */}
                {planLimiti.davetiyeLimit !== 999 && (
                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className={user.plan === "free" ? "text-gray-500" : "text-white/50"}>
                        Davetiye kullanımı
                      </span>
                      <span className={`font-bold ${
                        kullanim >= 80
                          ? "text-red-400"
                          : user.plan === "free" ? "text-purple-600" : "text-white"
                      }`}>
                        {aktifSayi} / {planLimiti.davetiyeLimit}
                      </span>
                    </div>
                    <div className={`h-2.5 rounded-full overflow-hidden ${user.plan === "free" ? "bg-gray-100" : "bg-white/10"}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          kullanim >= 80
                            ? "bg-linear-to-r from-red-400 to-red-500"
                            : user.plan === "free"
                            ? "bg-linear-to-r from-purple-500 to-pink-500"
                            : "bg-linear-to-r from-white/80 to-white/60"
                        }`}
                        style={{ width: `${Math.min(kullanim, 100)}%` }}
                      />
                    </div>
                    {kullanim >= 80 && (
                      <p className="text-xs text-red-400 mt-1.5">
                        ⚠️ Limit dolmak üzere. <Link href="/fiyatlar" className="underline font-semibold">Planını yükselt</Link>
                      </p>
                    )}
                  </div>
                )}

                {/* Özellikler grid */}
                <div className="grid grid-cols-2 gap-2">
                  {planLimiti.ozellikler.map(o => (
                    <div
                      key={o}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${
                        user.plan === "free"
                          ? "bg-gray-50 text-gray-600"
                          : "bg-white/8 text-white/70"
                      }`}
                    >
                      <span className={`shrink-0 ${user.plan === "free" ? "text-purple-500" : "text-white/50"}`}>✓</span>
                      {o}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6">
              <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase mb-5">Hesap İstatistikleri</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { n: user.davetiyeler.length, l: "Davetiye",      icon: "📨", color: "bg-purple-50 text-purple-600" },
                  { n: toplamGorunt,            l: "Görüntülenme",  icon: "👁️", color: "bg-blue-50 text-blue-600" },
                  { n: toplamRsvp,              l: "RSVP",          icon: "✉️", color: "bg-amber-50 text-amber-600" },
                  { n: toplamKatilim,           l: "Katılım",       icon: "✅", color: "bg-emerald-50 text-emerald-600" },
                ].map(stat => (
                  <div key={stat.l} className="text-center">
                    <div className={`w-11 h-11 ${stat.color} rounded-2xl flex items-center justify-center text-xl mx-auto mb-2`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 tabular-nums">{stat.n}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SAĞ — Aksiyonlar (1/3) */}
          <div>
            <AyarlarClient plan={user.plan} planIsim={planIsim} />
          </div>
        </div>
      </div>
    </div>
  );
}
