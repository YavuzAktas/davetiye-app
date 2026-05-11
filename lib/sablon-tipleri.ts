export interface DavetiyeVeri {
  id: string;
  slug: string;
  baslik: string;
  etkinlikTur: string;
  tarih: Date | null;
  mekan: string | null;
  mesaj: string | null;
  sablon: string;
  ozelRenk: string | null;
  font: string | null;
  muzik: string | null;
  goruntulenme: number;
  user: {
    name: string | null;
    email: string | null;
  };
  kisi1: string | null;
  kisi2: string | null;
  spotifyAktif: boolean;
  albumAktif: boolean;
  polaroid1: string | null;
  polaroid2: string | null;
  polaroid3: string | null;
  sesliAniAktif: boolean;
  canliDuvarAktif: boolean;
  dressKod: string | null;
  dressKodRenkler: string | null;
}

export interface SablonProps {
  davetiye: DavetiyeVeri;
  rsvpBileseni: React.ReactNode;
}