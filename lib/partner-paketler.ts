export const PARTNER_PAKETLERI = {
  baslangic: {
    id: "baslangic",
    ad: "Başlangıç",
    hakSayisi: 10,
    aylikTutar: 599,
    renk: "#6366f1",
    aciklama: "Küçük ölçekli işletmeler ve sektöre yeni girenler için",
  },
  profesyonel: {
    id: "profesyonel",
    ad: "Profesyonel",
    hakSayisi: 30,
    aylikTutar: 1499,
    renk: "#9333ea",
    aciklama: "Aktif düğün & etkinlik organizatörleri için",
  },
  kurumsal: {
    id: "kurumsal",
    ad: "Kurumsal",
    hakSayisi: 75,
    aylikTutar: 3499,
    renk: "#dc2626",
    aciklama: "Büyük ajanslar ve yüksek hacimli organizatörler için",
  },
} as const;

export type PartnerPaketId = keyof typeof PARTNER_PAKETLERI;
export const PARTNER_PAKET_LISTESI = Object.values(PARTNER_PAKETLERI);

export function paketGetir(id: string) {
  return PARTNER_PAKETLERI[id as PartnerPaketId] ?? null;
}

// Aktivasyon koduyla ücretsiz dahil edilen fiyat kodu listesi (paket başına)
// Kodlar lib/davetiye-fiyatlandirma.ts DAVETIYE_FIYAT_KALEMLERI ile eşleşmeli
// Yönetim araçları (oturma-plani, qr-check-in, ani-kitabi-pdf) Kurumsal'da dahil
export const PARTNER_PAKET_DAHIL: Record<string, string[]> = {
  baslangic: [
    "temel-davetiye",
    "muzik",
    "ani-defteri",
  ],
  profesyonel: [
    "temel-davetiye",
    "luks-sablon",
    "muzik",
    "album-foto",
    "ani-defteri",
    "canli-duvar",
  ],
  kurumsal: [
    "temel-davetiye",
    "luks-sablon",
    "muzik",
    "album-foto",
    "ani-defteri",
    "canli-duvar",
    "sesli-ani",
    "oturma-plani",
    "qr-check-in",
    "ani-kitabi-pdf",
  ],
};

export function dahilKodlarGetir(paketId: string): string[] {
  return PARTNER_PAKET_DAHIL[paketId] ?? ["temel-davetiye"];
}
