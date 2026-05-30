import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import AdminPartnerListesi from "./AdminPartnerListesi";

export const dynamic = "force-dynamic";

export default async function AdminPartnerlerPage() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) redirect("/");

  const partnerler = await prisma.partner.findMany({
    orderBy: [
      { durum: "asc" },
      { createdAt: "desc" },
    ],
    include: {
      user: { select: { email: true, name: true } },
      abonelikler: { where: { aktif: true }, take: 1 },
      _count: { select: { aktivasyonKodlari: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold text-purple-600 tracking-widest uppercase mb-1">Admin</p>
          <h1 className="text-2xl font-black text-gray-900">Partner Başvuruları</h1>
          <p className="text-sm text-gray-400 mt-1">{partnerler.length} kayıt</p>
        </div>

        <AdminPartnerListesi
          partnerler={partnerler.map(p => ({
            id: p.id,
            firmaAdi: p.firmaAdi,
            durum: p.durum,
            createdAt: p.createdAt.toISOString(),
            basvuruDetay: (p.basvuruDetay as Record<string, string> | null) ?? null,
            user: p.user,
            abonelikler: p.abonelikler.map(ab => ({
              paketId: ab.paketId,
              kullanilanHak: ab.kullanilanHak,
              hakSayisi: ab.hakSayisi,
              bitisAt: ab.bitisAt?.toISOString() ?? null,
            })),
            _count: p._count,
          }))}
        />
      </div>
    </div>
  );
}
