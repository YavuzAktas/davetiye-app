const LUKS_SABLON_IDS = new Set(["nisan-luks", "dugun-luks", "dogumgunu-luks"]);

export type DavetiyeFiyatGirdisi = {
  sablon?: string | null;
  muzik?: string | null;
  albumAktif?: boolean | null;
  sesliAniAktif?: boolean | null;
  canliDuvarAktif?: boolean | null;
  oturmaPlanAktif?: boolean | null;
};

export type DavetiyeFiyatKalemi = {
  kod: string;
  ad: string;
  tutar: number;
};

export type DavetiyeFiyatSonucu = {
  paraBirimi: "TRY";
  araToplam: number;
  toplamTutar: number;
  kalemler: DavetiyeFiyatKalemi[];
};

export const DAVETIYE_FIYAT_KALEMLERI = {
  temel: { kod: "temel-davetiye", ad: "Dijital davetiye", tutar: 299 },
  luksSablon: { kod: "luks-sablon", ad: "Lüks şablon", tutar: 100 },
  muzik: { kod: "muzik", ad: "Müzik ekleme", tutar: 69 },
  album: { kod: "album-ani", ad: "Albüm ve anı alanı", tutar: 129 },
  sesliAni: { kod: "sesli-ani", ad: "Sesli anı defteri", tutar: 149 },
  canliDuvar: { kod: "canli-duvar", ad: "Canlı fotoğraf duvarı", tutar: 169 },
  oturmaPlan: { kod: "oturma-plani", ad: "Oturma planı", tutar: 199 },
} as const;

function kalemEkle(kalemler: DavetiyeFiyatKalemi[], kalem: DavetiyeFiyatKalemi, kosul: boolean) {
  if (kosul) kalemler.push(kalem);
}

export function davetiyeFiyatiHesapla(girdi: DavetiyeFiyatGirdisi): DavetiyeFiyatSonucu {
  const kalemler: DavetiyeFiyatKalemi[] = [{ ...DAVETIYE_FIYAT_KALEMLERI.temel }];

  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.luksSablon }, !!girdi.sablon && LUKS_SABLON_IDS.has(girdi.sablon));
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.muzik }, !!girdi.muzik);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.album }, girdi.albumAktif === true);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.sesliAni }, girdi.sesliAniAktif === true);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.canliDuvar }, girdi.canliDuvarAktif === true);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.oturmaPlan }, girdi.oturmaPlanAktif === true);

  const toplamTutar = kalemler.reduce((toplam, kalem) => toplam + kalem.tutar, 0);

  return {
    paraBirimi: "TRY",
    araToplam: toplamTutar,
    toplamTutar,
    kalemler,
  };
}

/** Görsel "önceki fiyat" — ödeme hesaplamasında kullanılmaz */
export const ASIL_FIYAT_KODU: Record<string, number> = {
  "temel-davetiye": 399,
  "luks-sablon":    149,
  "muzik":          99,
  "album-ani":      179,
  "sesli-ani":      199,
  "canli-duvar":    229,
  "oturma-plani":   269,
};

export function indirimOrani(asil: number, simdiki: number): number {
  return Math.round((1 - simdiki / asil) * 100);
}

export function tutarMetni(tutar: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(tutar);
}
