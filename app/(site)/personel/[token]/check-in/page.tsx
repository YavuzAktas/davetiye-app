import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PERSONEL_ROLLERI, personelTokenHash } from "@/lib/personel-erisim";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import CheckInClient from "../../../dashboard/davetiye/[slug]/check-in/CheckInClient";

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata = {
  title: "Personel Check-in | DavetRota",
  robots: { index: false },
};

export default async function PersonelCheckInPage({ params }: Props) {
  const { token } = await params;
  const simdi = new Date();
  const erisim = await prisma.davetiyePersonelErisim.findFirst({
    where: {
      tokenHash: personelTokenHash(token),
      aktif: true,
      rol: PERSONEL_ROLLERI.checkIn,
      OR: [{ expiresAt: null }, { expiresAt: { gt: simdi } }],
    },
    select: {
      etiket: true,
      expiresAt: true,
      davetiye: {
        select: {
          id: true,
          slug: true,
          baslik: true,
          odemeDurumu: true,
          checkInAktif: true,
          _count: { select: { davetliler: true } },
        },
      },
    },
  });

  if (!erisim || !davetiyeOzelligiAktif(erisim.davetiye, "checkIn")) notFound();

  const girisYapan = await prisma.davetli.count({
    where: { davetiyeId: erisim.davetiye.id, checkinAt: { not: null } },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            QR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-gray-400">{erisim.davetiye.baslik}</p>
            <h1 className="text-base font-black text-gray-900">Personel QR Check-in</h1>
          </div>
          <span className="hidden rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
            Sınırlı yetki
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-4 rounded-3xl border border-gray-100 bg-white px-5 py-4">
          <p className="text-sm font-black text-gray-900">
            {erisim.etiket || "Etkinlik giriş personeli"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Bu link yalnızca davetli QR kodu okutmak için kullanılabilir.
            {erisim.expiresAt && (
              <> Süre: {new Date(erisim.expiresAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} tarihine kadar.</>
            )}
          </p>
        </div>

        <CheckInClient
          slug={erisim.davetiye.slug}
          toplam={erisim.davetiye._count.davetliler}
          baslangicGiris={girisYapan}
          apiPath={`/api/personel/erisim/${encodeURIComponent(token)}/check-in`}
          personelModu
        />

        <p className="mt-6 text-center text-[11px] leading-relaxed text-gray-400">
          Erişiminizde sorun varsa davetiye sahibinden yeni personel linki isteyin.{" "}
          <Link href="/" className="font-semibold text-purple-500 hover:underline">DavetRota</Link>
        </p>
      </main>
    </div>
  );
}
