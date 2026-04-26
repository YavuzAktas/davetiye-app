import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

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

  if (!davetiye || davetiye.userId !== user.id) notFound();

  const katilimlar = davetiye.rsvplar.filter((r) => r.katilim);
  const katilmayanlar = davetiye.rsvplar.filter((r) => !r.katilim);
  const toplamKisi = katilimlar.reduce((acc, r) => acc + r.kisiSayisi, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {davetiye.baslik}
        </h1>
        <Link
          href={`/davetiye/${davetiye.slug}`}
          target="_blank"
          className="text-sm text-purple-600 hover:underline"
        >
          Davetiyeyi Görüntüle →
        </Link>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {davetiye.goruntulenme}
          </p>
          <p className="text-xs text-gray-400 mt-1">Görüntülenme</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-green-600">
            {katilimlar.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Katılıyor</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-gray-900">{toplamKisi}</p>
          <p className="text-xs text-gray-400 mt-1">Toplam Kişi</p>
        </div>
      </div>

      {/* RSVP Listesi */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">
            Katılım Bildirimleri ({davetiye.rsvplar.length})
          </h2>
        </div>

        {davetiye.rsvplar.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">
              Henüz katılım bildirimi yok
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {davetiye.rsvplar.map((rsvp) => (
              <div
                key={rsvp.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-800">{rsvp.ad}</p>
                  <div className="flex gap-3 mt-0.5">
                    {rsvp.email && (
                      <p className="text-xs text-gray-400">{rsvp.email}</p>
                    )}
                    {rsvp.not && (
                      <p className="text-xs text-gray-400 italic">
                        &quot;{rsvp.not}&quot;
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  {rsvp.katilim && (
                    <span className="text-xs text-gray-400">
                      {rsvp.kisiSayisi} kişi
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      rsvp.katilim
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-400"
                    }`}
                  >
                    {rsvp.katilim ? "Katılıyor" : "Katılmıyor"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Katılmayanlar varsa göster */}
      {katilmayanlar.length > 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          {katilmayanlar.length} kişi katılamayacağını bildirdi
        </p>
      )}
    </div>
  );
}