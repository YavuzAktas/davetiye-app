import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import AktivasyonSayfasi from "./AktivasyonSayfasi";

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

  const aktivasyon = await prisma.aktivasyonKodu.findUnique({
    where: { kod },
    include: { partner: { select: { firmaAdi: true } } },
  });

  /* ── Geçersiz / iptal ── */
  if (!aktivasyon || aktivasyon.durum === "iptal") {
    return (
      <PageShell>
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🔗</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Geçersiz Link</h1>
          <p className="text-sm text-gray-500">Bu aktivasyon linki bulunamadı veya iptal edildi.</p>
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
  return (
    <PageShell>
      <AktivasyonSayfasi kod={kod} firmaAdi={aktivasyon.partner.firmaAdi} />
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
