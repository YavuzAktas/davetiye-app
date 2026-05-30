"use client";

import { useState, useMemo } from "react";
import { paketGetir } from "@/lib/partner-paketler";
import PartnerEylemleri from "./PartnerEylemleri";

type PartnerItem = {
  id: string;
  firmaAdi: string;
  durum: string;
  createdAt: string;
  basvuruDetay: Record<string, string> | null;
  user: { email: string; name: string | null };
  abonelikler: Array<{
    paketId: string;
    kullanilanHak: number;
    hakSayisi: number;
    bitisAt: string | null;
  }>;
  _count: { aktivasyonKodlari: number };
};

const DURUM_RENK: Record<string, string> = {
  beklemede: "bg-yellow-100 text-yellow-700",
  aktif:     "bg-green-100 text-green-700",
  askida:    "bg-red-100 text-red-600",
};

const DURUM_FILTRELER = ["hepsi", "beklemede", "aktif", "askida"] as const;

export default function AdminPartnerListesi({ partnerler }: { partnerler: PartnerItem[] }) {
  const [arama, setArama] = useState("");
  const [durumFiltre, setDurumFiltre] = useState<typeof DURUM_FILTRELER[number]>("hepsi");

  const filtreli = useMemo(() => {
    const q = arama.trim().toLowerCase();
    return partnerler.filter(p => {
      if (durumFiltre !== "hepsi" && p.durum !== durumFiltre) return false;
      if (!q) return true;
      return (
        p.firmaAdi.toLowerCase().includes(q) ||
        p.user.email.toLowerCase().includes(q) ||
        (p.user.name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [partnerler, arama, durumFiltre]);

  const sayilar = useMemo(() => {
    const counts: Record<string, number> = { hepsi: partnerler.length };
    for (const p of partnerler) counts[p.durum] = (counts[p.durum] ?? 0) + 1;
    return counts;
  }, [partnerler]);

  return (
    <div className="space-y-4">
      {/* Filtre bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={arama}
          onChange={e => setArama(e.target.value)}
          placeholder="Firma adı veya e-posta ara…"
          className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all"
        />
        <div className="flex gap-1.5 shrink-0">
          {DURUM_FILTRELER.map(d => (
            <button
              key={d}
              onClick={() => setDurumFiltre(d)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
                durumFiltre === d
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {d === "hepsi" ? "Tümü" : d.charAt(0).toUpperCase() + d.slice(1)}
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                durumFiltre === d ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {sayilar[d] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtreli.length === 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-sm text-gray-400">
          {arama ? `"${arama}" için sonuç bulunamadı.` : "Bu filtreyle eşleşen partner yok."}
        </div>
      )}

      {filtreli.map(p => {
        const detay = p.basvuruDetay ?? {};
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
  );
}
