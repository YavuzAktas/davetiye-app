import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AyarlarClient from "@/components/AyarlarClient";

export default async function AyarlarSayfasi() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/giris");

  const [davetiyeGruplari, rsvpGruplari] = await Promise.all([
    prisma.davetiye.groupBy({
      by: ["aktif"],
      where: { userId: user.id },
      _count: { _all: true },
      _sum: { goruntulenme: true },
    }),
    prisma.rSVP.groupBy({
      by: ["katilim"],
      where: { davetiye: { userId: user.id } },
      _count: { _all: true },
    }),
  ]);

  const toplamDavetiye = davetiyeGruplari.reduce((a, grup) => a + grup._count._all, 0);
  const toplamGorunt  = davetiyeGruplari.reduce((a, grup) => a + (grup._sum.goruntulenme ?? 0), 0);
  const toplamRsvp    = rsvpGruplari.reduce((a, grup) => a + grup._count._all, 0);
  const toplamKatilim = rsvpGruplari.find((grup) => grup.katilim)?._count._all ?? 0;

  const uyeOlduTarih = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(user.createdAt));

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
            <Link href="/dashboard" className="hover:text-white/60 transition-colors">Davetiyelerim</Link>
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
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-purple-400/30 ring-offset-2 ring-offset-[#080112]"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center text-3xl text-white font-bold ring-4 ring-purple-400/30 ring-offset-2 ring-offset-[#080112]">
                  {(user.name ?? "U")[0]}
                </div>
              )}
            </div>

            {/* İsim + meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">
                {user.name ?? "Kullanıcı"}
              </h1>
              <p className="text-white/40 text-sm mb-3 truncate">{user.email}</p>
              <div className="flex flex-wrap items-center gap-3">
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

          {/* SOL — Bilgi hiyerarşisi (2/3) */}
          <div className="lg:col-span-2 space-y-5">

            {/* 1. Profil Bilgileri */}
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

            {/* 2. İstatistikler */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6">
              <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase mb-5">Hesap İstatistikleri</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { n: toplamDavetiye,          l: "Davetiye",      icon: "📨", color: "bg-purple-50 text-purple-600" },
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
          <div className="space-y-4">
            <AyarlarClient />

            {/* Hızlı Erişim */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5">
              <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase mb-3">Hızlı Erişim</p>
              <div className="space-y-1.5">
                {[
                  { href: "/dashboard", label: "Davetiyelerim", icon: "📨", desc: "Tüm davetiyeler" },
                  { href: "/dashboard/odeme-gecmisi", label: "Ödeme Geçmişi", icon: "🧾", desc: "Sipariş ve fatura" },
                  { href: "/sablonlar", label: "Yeni Davetiye", icon: "🎨", desc: "Şablondan başla" },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-xl flex items-center justify-center text-sm transition-colors shrink-0">
                      {link.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">{link.label}</p>
                      <p className="text-xs text-gray-400">{link.desc}</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-purple-400 transition-colors text-sm">→</span>
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
