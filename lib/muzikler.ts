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

// Tüm parçalar CC0 / Public Domain lisanslıdır.
// Dosyaları public/muzikler/ klasörüne koyun.
// Önerilen kaynak: https://pixabay.com/music (CC0)
export const MUZIKLER: Muzik[] = [
  {
    id: "romantik-piyano",
    isim: "Romantik Piyano",
    kategori: "romantik",
    dosya: "/muzikler/romantik-piyano.mp3",
    sure: "3:12",
  },
  {
    id: "ask-melodi",
    isim: "Aşk Melodisi",
    kategori: "romantik",
    dosya: "/muzikler/ask-melodi.mp3",
    sure: "2:48",
  },
  {
    id: "dugun-vals",
    isim: "Düğün Vals",
    kategori: "romantik",
    dosya: "/muzikler/dugun-vals.mp3",
    sure: "3:05",
  },
  {
    id: "klasik-keman",
    isim: "Klasik Keman",
    kategori: "klasik",
    dosya: "/muzikler/klasik-keman.mp3",
    sure: "2:55",
  },
  {
    id: "barok-suite",
    isim: "Barok Suite",
    kategori: "klasik",
    dosya: "/muzikler/barok-suite.mp3",
    sure: "3:30",
  },
  {
    id: "dogumgunu-parti",
    isim: "Parti Zamanı",
    kategori: "neseli",
    dosya: "/muzikler/dogumgunu-parti.mp3",
    sure: "2:20",
  },
  {
    id: "kutlama",
    isim: "Kutlama",
    kategori: "neseli",
    dosya: "/muzikler/kutlama.mp3",
    sure: "2:45",
  },
  {
    id: "huzur",
    isim: "Huzur",
    kategori: "sakin",
    dosya: "/muzikler/huzur.mp3",
    sure: "3:50",
  },
  {
    id: "dogal-sesler",
    isim: "Doğal Sesler",
    kategori: "sakin",
    dosya: "/muzikler/dogal-sesler.mp3",
    sure: "4:00",
  },
];
