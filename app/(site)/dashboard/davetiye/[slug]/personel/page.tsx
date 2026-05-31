import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import { personelRolEtiketi } from "@/lib/personel-erisim";
import PersonelErisimPaneli from "./PersonelErisimPaneli";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PersonelPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/giris");

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: {
      id: true,
      slug: true,
      baslik: true,
      checkInAktif: true,
      odemeDurumu: true,
      personelErisimleri: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          rol: true,
          etiket: true,
          aktif: true,
          expiresAt: true,
          lastUsedAt: true,
          revokedAt: true,
          createdAt: true,
        },
      },
    },
  });
  if (!davetiye) notFound();

  const checkInAktif = davetiyeOzelligiAktif(davetiye, "checkIn");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href={`/dashboard/davetiye/${slug}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Davetiyeye dön"
          >
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-gray-400">{davetiye.baslik}</p>
            <h1 className="text-base font-black text-gray-900">Personel Erişimi</h1>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {!checkInAktif ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
              🔒
            </div>
            <h2 className="text-xl font-black text-gray-900">QR Check-in aktif değil</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
              Personel modu şu an yalnızca QR check-in için kullanılabilir. Bu davetiyede check-in özelliği aktif değil.
            </p>
            <Link
              href={`/dashboard/davetiye/${slug}`}
              className="mt-6 inline-flex rounded-2xl bg-gray-950 px-6 py-3 text-sm font-black text-white"
            >
              Davetiyeye dön
            </Link>
          </div>
        ) : (
          <PersonelErisimPaneli
            slug={slug}
            baslangicErisimler={davetiye.personelErisimleri.map(e => ({
              ...e,
              rolEtiketi: personelRolEtiketi(e.rol),
              expiresAt: e.expiresAt?.toISOString() ?? null,
              lastUsedAt: e.lastUsedAt?.toISOString() ?? null,
              revokedAt: e.revokedAt?.toISOString() ?? null,
              createdAt: e.createdAt.toISOString(),
            }))}
          />
        )}
      </main>
    </div>
  );
}
