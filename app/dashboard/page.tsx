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
  const kullanim = Math.round((aktifDavetiyeSayisi / planLimiti.davetiyeLimit) * 100);

  const toplamGoruntulenme = user.davetiyeler.reduce((acc, d) => acc + d.goruntulenme, 0);
  const toplamRsvp = user.davetiyeler.reduce((acc, d) => acc + d.rsvplar.length, 0);
  const toplamKatilim = user.davetiyeler.reduce(
    (acc, d) => acc + d.rsvplar.filter((r) => r.katilim).length, 0
  );

  const emojiler: Record<string, string> = {
    dugun: "💍", nisan: "💑", dogumgunu: "🎂",
    sunnet: "⭐", kina: "🌿", kurumsal: "🎯", diger: "🎉",
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Üst Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Merhaba, {user.name?.split(" ")[0] ?? "Kullanıcı"} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Davetiyelerini buradan yönet</p>
          </div>
          <Link
            href="/sablonlar"
            className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm shadow-purple-200"
          >
            <span className="text-lg">+</span> Yeni Davetiye
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { etiket: "Toplam Davetiye", deger: user.davetiyeler.length, emoji: "📨", renk: "text-purple-600", bg: "bg-purple-50" },
            { etiket: "Görüntülenme", deger: toplamGoruntulenme, emoji: "👁️", renk: "text-blue-600", bg: "bg-blue-50" },
            { etiket: "RSVP Sayısı", deger: toplamRsvp, emoji: "✉️", renk: "text-amber-600", bg: "bg-amber-50" },
            { etiket: "Katılım Onayı", deger: toplamKatilim, emoji: "✅", renk: "text-green-600", bg: "bg-green-50" },
          ].map((stat) => (
            <div key={stat.etiket} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>
                {stat.emoji}
              </div>
              <p className={`text-2xl font-bold ${stat.renk}`}>{stat.deger}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.etiket}</p>
            </div>
          ))}
        </div>

        {/* Plan Durumu */}
        {/* Plan Kartı */}
<div className={`rounded-2xl p-5 mb-6 ${
  user.plan === "premium"
    ? "bg-gradient-to-r from-amber-500 to-orange-500"
    : user.plan === "standart"
    ? "bg-gradient-to-r from-purple-600 to-pink-600"
    : "bg-white border border-gray-100 shadow-sm"
}`}>
  <div className="flex items-center justify-between mb-4">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">
          {user.plan === "premium" ? "👑" : user.plan === "standart" ? "⭐" : "🆓"}
        </span>
        <p className={`font-bold ${user.plan === "free" ? "text-gray-800" : "text-white"}`}>
          {planLimiti.isim} Plan
        </p>
      </div>
      <p className={`text-sm ${user.plan === "free" ? "text-gray-500" : "text-white/80"}`}>
        {aktifDavetiyeSayisi} / {planLimiti.davetiyeLimit === 999 ? "∞" : planLimiti.davetiyeLimit} davetiye kullanıldı
      </p>
    </div>
    {user.plan === "free" && (
      <Link
        href="/fiyatlar"
        className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors"
      >
        Yükselt
      </Link>
    )}
    {user.plan === "standart" && (
      <Link
        href="/fiyatlar"
        className="bg-white text-purple-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-50 transition-colors"
      >
        Premium&apos;a Geç
      </Link>
    )}
    {user.plan === "premium" && (
      <span className="bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold">
        Aktif 🎉
      </span>
    )}
  </div>

  {/* Kullanım Çubuğu */}
  {planLimiti.davetiyeLimit !== 999 && (
    <div>
      <div className={`w-full h-2 rounded-full ${user.plan === "free" ? "bg-gray-100" : "bg-white/20"}`}>
        <div
          className={`h-2 rounded-full transition-all ${
            kullanim >= 80 ? "bg-red-500" : user.plan === "free" ? "bg-purple-500" : "bg-white"
          }`}
          style={{ width: `${Math.min(kullanim, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <p className={`text-xs ${user.plan === "free" ? "text-gray-400" : "text-white/70"}`}>
          {aktifDavetiyeSayisi} kullanıldı
        </p>
        <p className={`text-xs ${user.plan === "free" ? "text-gray-400" : "text-white/70"}`}>
          {planLimiti.davetiyeLimit - aktifDavetiyeSayisi} hak kaldı
        </p>
      </div>
    </div>
  )}

  {/* Özellikler */}
  <div className="flex flex-wrap gap-2 mt-4">
    {planLimiti.ozellikler.map((o) => (
      <span
        key={o}
        className={`text-xs px-2.5 py-1 rounded-full ${
          user.plan === "free"
            ? "bg-gray-100 text-gray-600"
            : "bg-white/20 text-white"
        }`}
      >
        ✓ {o}
      </span>
    ))}
  </div>
</div>

        {/* Davetiye Listesi */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg">Davetiyelerim</h2>
            <span className="text-sm text-gray-400">{user.davetiyeler.length} davetiye</span>
          </div>

          {user.davetiyeler.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm">
              <div className="text-5xl mb-4">🎉</div>
              <p className="font-semibold text-gray-700 mb-2">Henüz davetiyeniz yok</p>
              <p className="text-gray-400 text-sm mb-6">İlk davetiyenizi oluşturmak için şablonlara göz atın</p>
              <Link
                href="/sablonlar"
                className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Şablonlara Git
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {user.davetiyeler.map((davetiye) => {
                const sablon = SABLONLAR.find((s) => s.id === davetiye.sablon) || SABLONLAR[0];
                const katilimSayisi = davetiye.rsvplar.filter((r) => r.katilim).length;
                const katilmiyorSayisi = davetiye.rsvplar.filter((r) => !r.katilim).length;
                const emoji = emojiler[davetiye.etkinlikTur] ?? "🎉";

                return (
                  <div
                    key={davetiye.id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Sol — İkon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: sablon.renk + "20" }}
                    >
                      {emoji}
                    </div>

                    {/* Bilgiler */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{davetiye.baslik}</h3>
                      <div className="flex flex-wrap gap-3 mt-1">
                        {davetiye.tarih && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            📅 {new Date(davetiye.tarih).toLocaleDateString("tr-TR", {
                              day: "numeric", month: "long", year: "numeric",
                            })}
                          </span>
                        )}
                        {davetiye.mekan && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            📍 {davetiye.mekan}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* İstatistikler */}
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-700">{davetiye.goruntulenme}</p>
                        <p className="text-xs text-gray-400">Görüntüleme</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-500">{katilimSayisi}</p>
                        <p className="text-xs text-gray-400">Katılıyor</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-400">{katilmiyorSayisi}</p>
                        <p className="text-xs text-gray-400">Katılmıyor</p>
                      </div>
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        href={`/davetiye/${davetiye.slug}`}
                        target="_blank"
                        className="text-xs border border-gray-200 text-gray-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Görüntüle
                      </Link>
                      <Link
                        href={`/dashboard/davetiye/${davetiye.slug}`}
                        className="text-xs bg-purple-50 border border-purple-200 text-purple-600 px-3 py-2 rounded-xl hover:bg-purple-100 transition-colors"
                      >
                        Detay
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}