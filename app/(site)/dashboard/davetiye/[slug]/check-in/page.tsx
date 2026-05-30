import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import CheckInClient from "./CheckInClient";

interface Props { params: Promise<{ slug: string }> }

export default async function CheckInPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/giris");

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: {
      id: true,
      slug: true,
      baslik: true,
      sablon: true,
      odemeDurumu: true,
      checkInAktif: true,
      _count: { select: { davetliler: true } },
    },
  });
  if (!davetiye) notFound();

  const checkInOdendi = davetiyeOzelligiAktif(davetiye, "checkIn");

  if (!checkInOdendi) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white/90 border-b border-gray-100 sticky top-0 z-30 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <Link
              href={`/dashboard/davetiye/${slug}`}
              className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 truncate">{davetiye.baslik}</p>
              <h1 className="text-base font-bold text-gray-900">QR Check-in</h1>
            </div>
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
              🔒
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">QR Check-in aktif değil</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto mb-6">
              Bu özellik davetiye oluşturulurken seçilmelidir. Etkinlik girişini QR ile takip etmek için yeni bir davetiyede etkinleştirebilirsiniz.
            </p>
            <Link
              href={`/dashboard/davetiye/${slug}`}
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-2xl hover:bg-gray-800 transition-colors"
            >
              ← Davetiyeye dön
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const girisYapan = await prisma.davetli.count({
    where: { davetiyeId: davetiye.id, checkinAt: { not: null } },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white/90 border-b border-gray-100 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link
            href={`/dashboard/davetiye/${slug}`}
            className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">{davetiye.baslik}</p>
            <h1 className="text-base font-bold text-gray-900">QR Check-in</h1>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl shrink-0">
            {girisYapan} / {davetiye._count.davetliler} giriş
          </span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <CheckInClient
          slug={slug}
          toplam={davetiye._count.davetliler}
          baslangicGiris={girisYapan}
        />
      </main>
    </div>
  );
}
