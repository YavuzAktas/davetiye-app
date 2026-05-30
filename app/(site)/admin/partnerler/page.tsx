import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import PartnerEylemleri from "./PartnerEylemleri";
import { paketGetir } from "@/lib/partner-paketler";

export const dynamic = "force-dynamic";

const DURUM_RENK: Record<string, string> = {
  beklemede: "bg-yellow-100 text-yellow-700",
  aktif:     "bg-green-100 text-green-700",
  askida:    "bg-red-100 text-red-600",
};

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

        {partnerler.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-sm text-gray-400">
            Henüz başvuru yok.
          </div>
        )}

        <div className="space-y-4">
          {partnerler.map(p => {
            const detay = (p.basvuruDetay as Record<string, string> | null) ?? {};
            return (
              <div key={p.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base font-bold text-gray-900">{p.firmaAdi}</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${DURUM_RENK[p.durum] ?? "bg-gray-100 text-gray-500"}`}>
                        {p.durum}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {p.user.name && <span className="font-medium text-gray-700">{p.user.name} · </span>}
                      <a href={`mailto:${p.user.email}`} className="text-purple-600 hover:underline">{p.user.email}</a>
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400 mt-1">
                      {detay.firmaTuru && <span>🏷 {detay.firmaTuru}</span>}
                      {detay.aylikMusteriSayisi && <span>👥 {detay.aylikMusteriSayisi}</span>}
                      {detay.telefon && (
                        <a href={`tel:${detay.telefon}`} className="hover:text-purple-600 transition-colors">
                          📞 {detay.telefon}
                        </a>
                      )}
                      <span>📅 {new Date(p.createdAt).toLocaleDateString("tr-TR")}</span>
                    </div>

                    {/* Abonelik bilgisi */}
                    {p.abonelikler[0] ? (() => {
                      const ab = p.abonelikler[0];
                      const kalanGun = ab.bitisAt
                        ? Math.ceil((new Date(ab.bitisAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                        : null;
                      return (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 bg-green-50 rounded-xl px-3 py-2 mt-2">
                          <span className="font-semibold text-green-700">{paketGetir(ab.paketId)?.ad ?? ab.paketId} Paketi</span>
                          <span>{ab.kullanilanHak}/{ab.hakSayisi} hak</span>
                          {kalanGun !== null && (
                            <span className={kalanGun <= 5 ? "text-red-500 font-semibold" : ""}>
                              {kalanGun > 0 ? `${kalanGun}g kaldı` : "Süresi dolmuş"}
                            </span>
                          )}
                          <span>{p._count.aktivasyonKodlari} toplam kod</span>
                        </div>
                      );
                    })() : (
                      <div className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2 mt-2">
                        Aktif abonelik yok — {p._count.aktivasyonKodlari} toplam kod
                      </div>
                    )}

                    {detay.basvuruNotu && (
                      <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 mt-2 max-w-lg">
                        {detay.basvuruNotu}
                      </p>
                    )}
                  </div>
                  <PartnerEylemleri partnerId={p.id} durum={p.durum} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
