export interface Muzik {
  id: string;
  isim: string;
  kategori: "romantik" | "klasik" | "neseli" | "sakin";
  dosya: string; // /muzik/xxx.mp3
  sure: string;  // "2:34"
}

export const MUZIK_KATEGORILER: Record<Muzik["kategori"], string> = {
  romantik: "Romantik",
  klasik: "Klasik",
  neseli: "Neşeli",
  sakin: "Sakin",
};

export const MUZIKLER: Muzik[] = [
  {
    id: "romantik-1",
    isim: "Love",
    kategori: "romantik",
    dosya: "/muzik/love.mp3",
    sure: "3:08",
  },
  {
    id: "romantik-2",
    isim: "Love Piano",
    kategori: "romantik",
    dosya: "/muzik/love-piano.mp3",
    sure: "2:00",
  },
  {
    id: "romantik-3",
    isim: "Teaser",
    kategori: "romantik",
    dosya: "/muzik/teaser.mp3",
    sure: "1:07",
  },
  {
    id: "klasik-1",
    isim: "The Best Jazz Club In New Orleans",
    kategori: "klasik",
    dosya: "/muzik/the-best-jazz-club-in-new-orleans.mp3",
    sure: "2:00",
  },
  {
    id: "klasik-2",
    isim: "Cooking For Christmas",
    kategori: "klasik",
    dosya: "/muzik/cooking-for-christmas.mp3",
    sure: "2:19",
  },
  {
    id: "neseli-1",
    isim: "Energetic",
    kategori: "neseli",
    dosya: "/muzik/energetic.mp3",
    sure: "2:17",
  },
  {
    id: "neseli-2",
    isim: "Ukulele Smiles",
    kategori: "neseli",
    dosya: "/muzik/ukulele-smiles.mp3",
    sure: "2:22",
  },
  {
    id: "sakin-1",
    isim: "Nature",
    kategori: "sakin",
    dosya: "/muzik/nature.mp3",
    sure: "2:18",
  },
  {
    id: "sakin-2",
    isim: "Water",
    kategori: "sakin",
    dosya: "/muzik/water.mp3",
    sure: "1:09",
  },
];
