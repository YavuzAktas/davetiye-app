import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import OturmaPlanKarti from "@/components/OturmaPlanKarti";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ slug: string }> }

function Hero({ slug, baslik, alt }: { slug: string; baslik: string; alt: string }) {
  return (
    <div className="relative bg-[#080112] overflow-hidden">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-purple-700 opacity-20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="flex items-center gap-2 text-white/30 text-xs mb-8">
          <Link href="/dashboard" className="hover:text-white/60 transition-colors">Dashboard</Link>
          <span>›</span>
          <Link href={`/dashboard/davetiye/${slug}`} className="hover:text-white/60 transition-colors truncate max-w-40">{baslik}</Link>
          <span>›</span>
          <span className="text-white/50">Oturma Planı</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shrink-0">
            🪑
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Oturma Planı</h1>
            <p className="text-white/40 text-sm mt-1">{baslik} · {alt}</p>
          </div>
        </div>
      </div>
      <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
    </div>
  );
}

export default async function OturmaPlanSayfasi({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/giris");

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email: session.user.email } },
    select: {
      id: true,
      baslik: true,
      odemeDurumu: true,
      oturmaPlanAktif: true,
    },
  });
  if (!davetiye) notFound();

  if (!davetiyeOzelligiAktif(davetiye, "oturmaPlan")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Hero slug={slug} baslik={davetiye.baslik} alt="Ek özellik" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-gray-100 rounded-3xl px-6 py-16 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">🪑</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Oturma Planı bu davetiyede aktif değil</h2>
            <p className="text-gray-500 text-sm leading-relaxed">Bu özellik davetiye oluşturulurken seçilmemiş ya da henüz ödeme tamamlanmamış.</p>
          </div>
        </div>
      </div>
    );
  }

  const [masalar, atanmamis] = await Promise.all([
    prisma.masa.findMany({
      where: { davetiyeId: davetiye.id },
      orderBy: { sira: "asc" },
      select: {
        id: true,
        isim: true,
        kapasite: true,
        atamalar: {
          select: {
            id: true,
            rsvp: { select: { id: true, ad: true, kisiSayisi: true, diyet: true } },
          },
        },
      },
    }),
    prisma.rSVP.findMany({
      where: { davetiyeId: davetiye.id, katilim: true, masaAtamasi: null },
      select: { id: true, ad: true, kisiSayisi: true, diyet: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);
  const toplamKatilan = atanmamis.length + masalar.reduce((adet, masa) => adet + masa.atamalar.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero slug={slug} baslik={davetiye.baslik} alt={`${toplamKatilan} onaylı misafir`} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {toplamKatilan === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500 font-semibold text-lg">Henüz onaylı misafir yok</p>
            <p className="text-gray-400 text-sm mt-2">RSVP yanıtları geldikçe misafirler buraya eklenecek</p>
            <Link href={`/dashboard/davetiye/${slug}`} className="mt-6 inline-flex text-sm font-semibold text-purple-600 hover:text-purple-800">
              ← Davetiyeye dön
            </Link>
          </div>
        ) : (
          <OturmaPlanKarti
            slug={slug}
            masalarBaslangic={masalar as any}
            atanmamisBaslangic={atanmamis}
          />
        )}
      </div>
    </div>
  );
}
