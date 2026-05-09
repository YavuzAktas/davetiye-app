import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { SABLONLAR } from "@/lib/sablonlar";
import { ModerasyonIcerik } from "@/components/ModerasyonListe";

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
                {(davetiye.albumFotolar.filter(f => !f.onaylandi).length + davetiye.aniDefterleri.filter(a => !a.onaylandi).length) > 0 && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
                    {davetiye.albumFotolar.filter(f => !f.onaylandi).length + davetiye.aniDefterleri.filter(a => !a.onaylandi).length} onay bekliyor
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

        <ModerasyonIcerik
          baslangicFotolar={davetiye.albumFotolar.map((f) => ({ ...f, createdAt: f.createdAt.toISOString() }))}
          baslangicAnilar={davetiye.aniDefterleri.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
          slug={slug}
          renk={renk}
        />

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
