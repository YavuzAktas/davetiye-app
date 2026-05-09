import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { SABLONLAR } from "@/lib/sablonlar";
import { FotoSatirItem, AniSatirItem } from "@/components/ModerasyonSatir";

interface Props {
  params: Promise<{ slug: string }>;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default async function AlbumModerasyon({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/giris");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/giris");

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    include: {
      albumFotolar: { orderBy: { createdAt: "desc" } },
      aniDefterleri: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!davetiye || davetiye.userId !== user.id) notFound();

  const sablon = SABLONLAR.find((s) => s.id === davetiye.sablon) ?? SABLONLAR[0];
  const renk = sablon.renk;
  const rgb = hexToRgb(renk);

  const bekleyenFoto = davetiye.albumFotolar.filter((f) => !f.onaylandi);
  const onaylananFoto = davetiye.albumFotolar.filter((f) => f.onaylandi);
  const bekleyenAni = davetiye.aniDefterleri.filter((a) => !a.onaylandi);
  const onaylananAni = davetiye.aniDefterleri.filter((a) => a.onaylandi);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ══ DARK HERO ══ */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div
          className="absolute -top-20 left-1/4 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none"
          style={{ backgroundColor: renk }}
        />
        <div
          className="absolute bottom-0 right-1/3 w-56 h-56 rounded-full blur-[80px] opacity-15 pointer-events-none"
          style={{ backgroundColor: renk }}
        />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/30 text-xs mb-8">
            <Link href="/dashboard" className="hover:text-white/60 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
            <span>›</span>
            <Link href={`/dashboard/davetiye/${slug}`} className="hover:text-white/60 transition-colors">
              {davetiye.baslik}
            </Link>
            <span>›</span>
            <span className="text-white/50">Albüm & Anı</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl shrink-0 shadow-2xl"
              style={{ backgroundColor: renk + "22", border: `2px solid ${renk}44` }}
            >
              📸
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {bekleyenFoto.length + bekleyenAni.length > 0 && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
                    {bekleyenFoto.length + bekleyenAni.length} onay bekliyor
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight">
                Albüm & Anı Yönetimi
              </h1>
              <p className="text-white/40 text-sm">{davetiye.baslik}</p>
            </div>

            <Link
              href={`/dashboard/davetiye/${slug}`}
              className="shrink-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${renk}, ${renk}cc)`,
                color: "#fff",
                boxShadow: `0 4px 20px rgba(${rgb}, 0.4)`,
              }}
            >
              ← Davetiye
            </Link>
          </div>
        </div>

        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* ══ CONTENT ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Bekleyen Fotoğraf", value: bekleyenFoto.length, icon: "🕐", sub: "onay bekliyor" },
            { label: "Onaylı Fotoğraf", value: onaylananFoto.length, icon: "✅", sub: "albümde görünür" },
            { label: "Bekleyen Anı", value: bekleyenAni.length, icon: "🕐", sub: "onay bekliyor" },
            { label: "Onaylı Anı", value: onaylananAni.length, icon: "💬", sub: "herkese açık" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ backgroundColor: renk + "20", transform: "translate(40%, -40%)" }}
              />
              <div className="text-2xl mb-3">{stat.icon}</div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">{stat.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Fotoğraf Moderasyonu ── */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-50">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Fotoğraflar</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-gray-900">{davetiye.albumFotolar.length} toplam</span>
                {bekleyenFoto.length > 0 && (
                  <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                    {bekleyenFoto.length} beklemede
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {davetiye.albumFotolar.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🖼️</div>
                  <p className="text-gray-500 text-sm font-medium">Henüz fotoğraf yok</p>
                  <p className="text-gray-300 text-xs mt-1">Misafirler davetiye sayfasından fotoğraf yükleyebilir</p>
                </div>
              ) : (
                <>
                  {bekleyenFoto.length > 0 && (
                    <p className="text-[10px] font-bold text-amber-500 tracking-widest uppercase px-1">
                      Onay Bekleyenler
                    </p>
                  )}
                  {bekleyenFoto.map((foto) => (
                    <FotoSatirItem
                      key={foto.id}
                      foto={{ ...foto, createdAt: foto.createdAt.toISOString() }}
                      slug={slug}
                      renk={renk}
                    />
                  ))}
                  {onaylananFoto.length > 0 && (
                    <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase px-1 pt-2">
                      Onaylananlar
                    </p>
                  )}
                  {onaylananFoto.map((foto) => (
                    <FotoSatirItem
                      key={foto.id}
                      foto={{ ...foto, createdAt: foto.createdAt.toISOString() }}
                      slug={slug}
                      renk={renk}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* ── Anı Defteri Moderasyonu ── */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-50">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Anı Defteri</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-gray-900">{davetiye.aniDefterleri.length} toplam</span>
                {bekleyenAni.length > 0 && (
                  <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                    {bekleyenAni.length} beklemede
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {davetiye.aniDefterleri.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">📖</div>
                  <p className="text-gray-500 text-sm font-medium">Henüz anı yok</p>
                  <p className="text-gray-300 text-xs mt-1">Misafirler davetiye sayfasından anı bırakabilir</p>
                </div>
              ) : (
                <>
                  {bekleyenAni.length > 0 && (
                    <p className="text-[10px] font-bold text-amber-500 tracking-widest uppercase px-1">
                      Onay Bekleyenler
                    </p>
                  )}
                  {bekleyenAni.map((ani) => (
                    <AniSatirItem
                      key={ani.id}
                      ani={{ ...ani, createdAt: ani.createdAt.toISOString() }}
                      slug={slug}
                      renk={renk}
                    />
                  ))}
                  {onaylananAni.length > 0 && (
                    <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase px-1 pt-2">
                      Onaylananlar
                    </p>
                  )}
                  {onaylananAni.map((ani) => (
                    <AniSatirItem
                      key={ani.id}
                      ani={{ ...ani, createdAt: ani.createdAt.toISOString() }}
                      slug={slug}
                      renk={renk}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info box */}
        <div
          className="rounded-2xl p-5 flex gap-4"
          style={{ backgroundColor: renk + "08", border: `1px solid ${renk}20` }}
        >
          <span className="text-xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Moderasyon Hakkında</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Misafirler yüklediği fotoğraf ve yazdığı anılar önce burada görünür. Onayladıktan sonra davetiye sayfasındaki
              albümde herkese açık hale gelir. İstediğin zaman geri alabilir veya silebilirsin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
