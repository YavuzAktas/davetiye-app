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
