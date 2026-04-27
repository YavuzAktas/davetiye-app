export interface Muzik {
  id: string;
  isim: string;
  kategori: "romantik" | "klasik" | "neseli" | "sakin";
  dosya: string; // /muzikler/xxx.mp3
  sure: string;  // "2:34"
}

export const MUZIK_KATEGORILER: Record<Muzik["kategori"], string> = {
  romantik: "Romantik",
  klasik: "Klasik",
  neseli: "Neşeli",
  sakin: "Sakin",
};

// Tüm parçalar SoundHelix'ten alınmıştır.
// Lisans: soundhelix.com — "completely free to use in any context, commercial or not"
export const MUZIKLER: Muzik[] = [
  {
    id: "romantik-1",
    isim: "Romantik Melodi",
    kategori: "romantik",
    dosya: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    sure: "4:10",
  },
  {
    id: "romantik-2",
    isim: "Yumuşak Piyano",
    kategori: "romantik",
    dosya: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    sure: "3:45",
  },
  {
    id: "romantik-3",
    isim: "Aşk Teması",
    kategori: "romantik",
    dosya: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    sure: "5:02",
  },
  {
    id: "klasik-1",
    isim: "Klasik Oda Müziği",
    kategori: "klasik",
    dosya: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    sure: "4:28",
  },
  {
    id: "klasik-2",
    isim: "Yaylılar",
    kategori: "klasik",
    dosya: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    sure: "3:58",
  },
  {
    id: "neseli-1",
    isim: "Neşeli Ritim",
    kategori: "neseli",
    dosya: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    sure: "3:22",
  },
  {
    id: "neseli-2",
    isim: "Kutlama",
    kategori: "neseli",
    dosya: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    sure: "2:55",
  },
  {
    id: "sakin-1",
    isim: "Huzur",
    kategori: "sakin",
    dosya: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3",
    sure: "4:40",
  },
  {
    id: "sakin-2",
    isim: "Sessiz Akşam",
    kategori: "sakin",
    dosya: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    sure: "5:15",
  },
];
