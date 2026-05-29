export type RsvpSoruId = "sarki" | "yemek" | "ulasim" | "cocuk" | "alerji" | "ozel";

export interface RsvpSoru {
  id: RsvpSoruId;
  aktif: boolean;
  soru?: string; // "ozel" tipinde davet sahibinin yazdığı soru metni
}

export type RsvpSorular = RsvpSoru[];

export const VARSAYILAN_RSVP_SORULAR: RsvpSorular = [
  { id: "sarki",  aktif: true  },
  { id: "yemek",  aktif: false },
  { id: "ulasim", aktif: false },
  { id: "cocuk",  aktif: false },
  { id: "alerji", aktif: false },
  { id: "ozel",   aktif: false, soru: "" },
];

export const SORU_META: Record<RsvpSoruId, { label: string; icon: string; aciklama: string }> = {
  sarki:  { label: "Şarkı İsteği",    icon: "🎵", aciklama: "Dans pistindeki favori şarkınız?" },
  yemek:  { label: "Yemek / Özel Beslenme", icon: "🍽️", aciklama: "Yanıt verilirse misafirden ayrıca açık rıza alınır" },
  ulasim: { label: "Servis / Ulaşım", icon: "🚌", aciklama: "Servis kullanıp kullanmayacağını seçer" },
  cocuk:  { label: "Çocuk Katılımı",  icon: "👶", aciklama: "Yanında getireceği çocuk sayısını girer" },
  alerji: { label: "Alerji / Özel Beslenme Notu", icon: "⚠️", aciklama: "Yanıt verilirse misafirden ayrıca açık rıza alınır" },
  ozel:   { label: "Özel Soru",       icon: "💬", aciklama: "Kendi oluşturduğunuz soruya serbest metin yanıt" },
};

export function rsvpSorularCoz(json: unknown): RsvpSorular {
  let parsed = json;
  if (typeof json === "string") {
    try { parsed = JSON.parse(json); } catch { return VARSAYILAN_RSVP_SORULAR; }
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return VARSAYILAN_RSVP_SORULAR;
  return parsed as RsvpSorular;
}

export function soruAktifMi(sorular: RsvpSorular | null | undefined, id: RsvpSoruId): boolean {
  if (!sorular || sorular.length === 0) return id === "sarki";
  return sorular.find(s => s.id === id)?.aktif ?? false;
}

export function soruGetir(sorular: RsvpSorular | null | undefined, id: RsvpSoruId): RsvpSoru {
  if (!sorular || sorular.length === 0) {
    return VARSAYILAN_RSVP_SORULAR.find(s => s.id === id)!;
  }
  return sorular.find(s => s.id === id) ?? VARSAYILAN_RSVP_SORULAR.find(s => s.id === id)!;
}
