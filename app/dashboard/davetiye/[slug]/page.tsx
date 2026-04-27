import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DavetiyeDetay({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/giris");

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    include: {
      rsvplar: { orderBy: { createdAt: "desc" } },
    },
  });

  // null kontrolü yaparak TypeScript hatalarını gideriyoruz
  if (!davetiye || davetiye.userId !== user.id) notFound();

  const katilimlar = davetiye.rsvplar.filter((r) => r.katilim);
  const katilmayanlar = davetiye.rsvplar.filter((r) => !r.katilim);
  const toplamKisi = katilimlar.reduce((acc, r) => acc + r.kisiSayisi, 0);
  const davetiyeUrl = `${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye.slug}`;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Üst Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-bold text-gray-900">{davetiye.baslik}</h1>
              <p className="text-xs text-gray-400 mt-0.5">Davetiye Detayı</p>
            </div>
          </div>
          <Link
            href={davetiyeUrl}
            target="_blank"
            className="text-sm bg-purple-50 border border-purple-200 text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-100 transition-colors font-medium"
          >
            Davetiyeyi Gör →
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { etiket: "Görüntülenme", deger: davetiye.goruntulenme, emoji: "👁️", renk: "text-blue-600", bg: "bg-blue-50" },
            { etiket: "Katılıyor", deger: katilimlar.length, emoji: "✅", renk: "text-green-600", bg: "bg-green-50" },
            { etiket: "Toplam Kişi", deger: toplamKisi, emoji: "👥", renk: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat) => (
            <div key={stat.etiket} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-xl mx-auto mb-3`}>
                {stat.emoji}
              </div>
              <p className={`text-3xl font-bold ${stat.renk}`}>{stat.deger}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.etiket}</p>
            </div>
          ))}
        </div>

        {/* QR Kod ve Paylaşım */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="text-lg">🔗</span> Paylaşım
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start">

            {/* QR Kod */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <img
                  src={`/api/qr?url=${encodeURIComponent(davetiyeUrl)}`}
                  alt="QR Kod"
                  className="w-32 h-32 rounded-lg"
                />
              </div>
              <a
                href={`/api/qr?url=${encodeURIComponent(davetiyeUrl)}`}
                download={`davetiye-${davetiye.slug}.png`}
                className="text-xs text-purple-600 hover:underline font-medium flex items-center gap-1"
              >
                ⬇️ QR Kodu İndir
              </a>
            </div>

            {/* Link ve Butonlar */}
            <div className="flex-1 w-full space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Davetiye Linki
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={davetiyeUrl}
                    className="flex-1 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-600 focus:outline-none"
                  />
                  <CopyButton text={davetiyeUrl} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Hızlı Paylaşım
                </p>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(davetiye.baslik + " - " + davetiyeUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-green-600 transition-colors font-medium"
                  >
                    <span>💬</span> WhatsApp
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(davetiyeUrl)}&text=${encodeURIComponent(davetiye.baslik)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-500 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-colors font-medium"
                  >
                    <span>✈️</span> Telegram
                  </a>
                  <Link
                    href={`/dashboard/davetiye/${davetiye.slug}/davetliler`}
                    className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-600 text-sm px-4 py-2.5 rounded-xl hover:bg-purple-100 transition-colors font-medium"
                  >
                    <span>👥</span> Davetliler
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Listesi */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">✉️</span>
              Katılım Bildirimleri
              <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {davetiye.rsvplar.length}
              </span>
            </h2>
            {katilmayanlar.length > 0 && (
              <span className="text-xs text-gray-400">
                {katilmayanlar.length} kişi katılamıyor
              </span>
            )}
          </div>

          {davetiye.rsvplar.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-400 text-sm">Henüz katılım bildirimi yok</p>
              <p className="text-gray-300 text-xs mt-1">Davetiyeyi paylaşınca bildirimler burada görünecek</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {davetiye.rsvplar.map((rsvp) => (
                <div key={rsvp.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                      rsvp.katilim ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"
                    }`}>
                      {rsvp.ad[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{rsvp.ad}</p>
                      <div className="flex gap-2 mt-0.5">
                        {rsvp.email && (
                          <p className="text-xs text-gray-400">{rsvp.email}</p>
                        )}
                        {rsvp.not && (
                          <p className="text-xs text-gray-400 italic">&quot;{rsvp.not}&quot;</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {rsvp.katilim && (
                      <span className="text-xs text-gray-400 font-medium">
                        {rsvp.kisiSayisi} kişi
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      rsvp.katilim
                        ? "bg-green-100 text-green-700"
                        : "bg-red-50 text-red-500"
                    }`}>
                      {rsvp.katilim ? "✓ Katılıyor" : "✗ Katılmıyor"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}