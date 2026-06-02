const LUKS_SABLON_IDS = new Set(["nisan-luks", "vintage-nisan", "dugun-luks", "dogumgunu-luks"]);

export type DavetiyeFiyatGirdisi = {
  sablon?: string | null;
  muzik?: string | null;
  albumAktif?: boolean | null;
  aniDefteriAktif?: boolean | null;
  sesliAniAktif?: boolean | null;
  canliDuvarAktif?: boolean | null;
  oturmaPlanAktif?: boolean | null;
  aniKitabiAktif?: boolean | null;
  checkInAktif?: boolean | null;
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
  temel: { kod: "temel-davetiye", ad: "Dijital davetiye", tutar: 349 },
  luksSablon: { kod: "luks-sablon", ad: "Lüks şablon", tutar: 149 },
  muzik: { kod: "muzik", ad: "Müzik ekleme", tutar: 79 },
  album: { kod: "album-foto", ad: "Fotoğraf albümü", tutar: 129 },
  aniDefteri: { kod: "ani-defteri", ad: "Anı defteri", tutar: 99 },
  canliDuvar: { kod: "canli-duvar", ad: "Canlı fotoğraf duvarı", tutar: 199 },
  sesliAni: { kod: "sesli-ani", ad: "Sesli anı defteri", tutar: 149 },
  oturmaPlan: { kod: "oturma-plani", ad: "Oturma planı", tutar: 249 },
  aniKitabi:  { kod: "ani-kitabi-pdf", ad: "Anı Kitabı PDF", tutar: 149 },
  checkIn:    { kod: "qr-check-in", ad: "QR Check-in", tutar: 149 },
} as const;

function kalemEkle(kalemler: DavetiyeFiyatKalemi[], kalem: DavetiyeFiyatKalemi, kosul: boolean) {
  if (kosul) kalemler.push(kalem);
}

export function davetiyeFiyatiHesapla(girdi: DavetiyeFiyatGirdisi): DavetiyeFiyatSonucu {
  const kalemler: DavetiyeFiyatKalemi[] = [{ ...DAVETIYE_FIYAT_KALEMLERI.temel }];

  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.luksSablon }, !!girdi.sablon && LUKS_SABLON_IDS.has(girdi.sablon));
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.muzik }, !!girdi.muzik);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.album }, girdi.albumAktif === true);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.aniDefteri }, girdi.aniDefteriAktif === true);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.canliDuvar }, girdi.canliDuvarAktif === true);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.sesliAni }, girdi.sesliAniAktif === true);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.oturmaPlan }, girdi.oturmaPlanAktif === true);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.aniKitabi },  girdi.aniKitabiAktif  === true);
  kalemEkle(kalemler, { ...DAVETIYE_FIYAT_KALEMLERI.checkIn },    girdi.checkInAktif    === true);

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
  "temel-davetiye": 499,
  "luks-sablon":    249,
  "muzik":          129,
  "album-foto":     199,
  "ani-defteri":    149,
  "canli-duvar":    299,
  "sesli-ani":      249,
  "oturma-plani":   349,
  "ani-kitabi-pdf": 249,
  "qr-check-in":    249,
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
