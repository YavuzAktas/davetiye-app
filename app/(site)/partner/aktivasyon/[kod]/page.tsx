import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import AktivasyonSayfasi from "./AktivasyonSayfasi";
import { dahilKodlarGetir } from "@/lib/partner-paketler";

export const metadata: Metadata = {
  title: "Aktivasyon | Bekleriz",
  robots: { index: false },
};

const KULLANILMIS_DURUMLAR = new Set(["davetiye_olusturuldu", "yayinda"]);

export default async function AktivasyonPage({
  params,
}: {
  params: Promise<{ kod: string }>;
}) {
  const { kod } = await params;
  const simdi = new Date();

  const aktivasyon = await prisma.aktivasyonKodu.findUnique({
    where: { kod },
    include: {
      abonelik: { select: { aktif: true, bitisAt: true, paketId: true } },
      partner: {
        select: {
          firmaAdi: true,
          logoUrl: true,
          markaRenk: true,
          markaSlogani: true,
          destekTelefonu: true,
          instagramUrl: true,
          durum: true,
        },
      },
    },
  });

  /* ── Geçersiz / iptal ── */
  const linkGecersiz =
    !aktivasyon ||
    aktivasyon.durum === "iptal" ||
    aktivasyon.partner.durum !== "aktif" ||
    !!(aktivasyon.expiresAt && aktivasyon.expiresAt < simdi) ||
    !aktivasyon.abonelik ||
    !aktivasyon.abonelik.aktif ||
    !!(aktivasyon.abonelik.bitisAt && aktivasyon.abonelik.bitisAt < simdi);

  if (linkGecersiz) {
    return (
      <PageShell>
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🔗</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Geçersiz Link</h1>
          <p className="text-sm text-gray-500">Bu aktivasyon linki bulunamadı, iptal edildi veya süresi doldu.</p>
        </div>
      </PageShell>
    );
  }

  /* ── Başkası kullanmış ── */
  if (KULLANILMIS_DURUMLAR.has(aktivasyon.durum)) {
    // Kodu kullanan kişi mi bakıyor?
    const session = await getServerSession(authOptions);
    const kendisi = session?.user?.id && aktivasyon.musteriUserId === session.user.id;

    return (
      <PageShell>
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            {kendisi ? "Bu Kodu Zaten Kullandınız" : "Bu Link Kullanıldı"}
          </h1>
          <p className="text-sm text-gray-500">
            {kendisi
              ? "Davetiyenizi dashboard'dan yönetebilirsiniz."
              : "Bu aktivasyon linki daha önce kullanıldı."}
          </p>
          {kendisi && (
            <a
              href="/dashboard"
              className="inline-block mt-6 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition-opacity text-sm"
            >
              Dashboard'a Git →
            </a>
          )}
        </div>
      </PageShell>
    );
  }

  /* ── Kullanılabilir ── */
  const dahilKodlar = dahilKodlarGetir(aktivasyon.abonelik!.paketId);

  return (
    <PageShell>
      <AktivasyonSayfasi
        kod={kod}
        firmaAdi={aktivasyon.partner.firmaAdi}
        logoUrl={aktivasyon.partner.logoUrl}
        marka={{
          renk: aktivasyon.partner.markaRenk,
          slogan: aktivasyon.partner.markaSlogani,
          destekTelefonu: aktivasyon.partner.destekTelefonu,
          instagramUrl: aktivasyon.partner.instagramUrl,
        }}
        dahilKodlar={dahilKodlar}
      />
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
        {children}
      </div>
    </div>
  );
}
