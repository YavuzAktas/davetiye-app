export const PARTNER_PAKETLERI = {
  baslangic: {
    id: "baslangic",
    ad: "Başlangıç",
    hakSayisi: 10,
    aylikTutar: 399,
    renk: "#6366f1",
  },
  profesyonel: {
    id: "profesyonel",
    ad: "Profesyonel",
    hakSayisi: 30,
    aylikTutar: 999,
    renk: "#9333ea",
  },
} as const;

export type PartnerPaketId = keyof typeof PARTNER_PAKETLERI;
export const PARTNER_PAKET_LISTESI = Object.values(PARTNER_PAKETLERI);

export function paketGetir(id: string) {
  return PARTNER_PAKETLERI[id as PartnerPaketId] ?? null;
}

// Aktivasyon koduyla ücretsiz dahil edilen fiyat kodu listesi (paket başına)
// Kodlar lib/davetiye-fiyatlandirma.ts DAVETIYE_FIYAT_KALEMLERI ile eşleşmeli
export const PARTNER_PAKET_DAHIL: Record<string, string[]> = {
  baslangic:   ["temel-davetiye"],
  profesyonel: ["temel-davetiye", "muzik"],
};

export function dahilKodlarGetir(paketId: string): string[] {
  return PARTNER_PAKET_DAHIL[paketId] ?? ["temel-davetiye"];
}
