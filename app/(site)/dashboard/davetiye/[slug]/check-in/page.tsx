import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
      _count: { select: { davetliler: true } },
    },
  });
  if (!davetiye) notFound();

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
