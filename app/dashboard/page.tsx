import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SABLONLAR } from "@/lib/sablonlar";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/giris");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      davetiyeler: {
        orderBy: { createdAt: "desc" },
        include: {
          rsvplar: true,
        },
      },
    },
  });

  if (!user) redirect("/giris");

  const toplamGoruntulenme = user.davetiyeler.reduce(
    (acc, d) => acc + d.goruntulenme,
    0
  );
  const toplamRsvp = user.davetiyeler.reduce(
    (acc, d) => acc + d.rsvplar.length,
    0
  );
  const toplamKatilim = user.davetiyeler.reduce(
    (acc, d) => acc + d.rsvplar.filter((r) => r.katilim).length,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Başlık */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Merhaba, {user.name?.split(" ")[0] ?? "Kullanıcı"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Davetiyelerini buradan yönet</p>
        </div>
        <Link
          href="/sablonlar"
          className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          + Yeni Davetiye
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Toplam Davetiye</p>
          <p className="text-3xl font-bold text-gray-900">
            {user.davetiyeler.length}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Toplam Görüntülenme</p>
          <p className="text-3xl font-bold text-gray-900">
            {toplamGoruntulenme}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Katılım Onayı</p>
          <p className="text-3xl font-bold text-gray-900">
            {toplamKatilim}
            <span className="text-lg text-gray-400 font-normal">
              /{toplamRsvp}
            </span>
          </p>
        </div>
      </div>

      {/* Davetiye Listesi */}
      {user.davetiyeler.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
          <p className="text-4xl mb-4">🎉</p>
          <p className="font-semibold text-gray-700 mb-2">
            Henüz davetiyeniz yok
          </p>
          <p className="text-gray-400 text-sm mb-6">
            İlk davetiyenizi oluşturmak için şablonlara göz atın
          </p>
          <Link
            href="/sablonlar"
            className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Şablonlara Git
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {user.davetiyeler.map((davetiye) => {
            const sablon =
              SABLONLAR.find((s) => s.id === davetiye.sablon) || SABLONLAR[0];
            const katilimSayisi = davetiye.rsvplar.filter(
              (r) => r.katilim
            ).length;
            const katilmiyorSayisi = davetiye.rsvplar.filter(
              (r) => !r.katilim
            ).length;

            return (
              <div
                key={davetiye.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Renk Göstergesi */}
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: sablon.renk }}
                >
                  {davetiye.etkinlikTur === "dugun" && "💍"}
                  {davetiye.etkinlikTur === "nisan" && "💑"}
                  {davetiye.etkinlikTur === "dogumgunu" && "🎂"}
                  {davetiye.etkinlikTur === "sunnet" && "⭐"}
                  {davetiye.etkinlikTur === "kina" && "🌿"}
                  {davetiye.etkinlikTur === "diger" && "🎉"}
                </div>

                {/* Bilgiler */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {davetiye.baslik}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {davetiye.tarih && (
                      <span className="text-xs text-gray-400">
                        📅{" "}
                        {new Date(davetiye.tarih).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {davetiye.mekan && (
                      <span className="text-xs text-gray-400">
                        📍 {davetiye.mekan}
                      </span>
                    )}
                  </div>
                </div>

                {/* İstatistikler */}
                <div className="flex gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      {davetiye.goruntulenme}
                    </p>
                    <p className="text-xs text-gray-400">Görüntüleme</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">
                      {katilimSayisi}
                    </p>
                    <p className="text-xs text-gray-400">Katılıyor</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-400">
                      {katilmiyorSayisi}
                    </p>
                    <p className="text-xs text-gray-400">Katılmıyor</p>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="flex gap-2">
                  <Link
                    href={`/davetiye/${davetiye.slug}`}
                    target="_blank"
                    className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Görüntüle
                  </Link>
                  <Link
                    href={`/dashboard/davetiye/${davetiye.slug}`}
                    className="text-sm border border-purple-200 text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50 transition-colors"
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
  );
}