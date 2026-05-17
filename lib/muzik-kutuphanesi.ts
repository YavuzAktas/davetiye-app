export type MuzikKategori = "romantik" | "klasik" | "modern" | "enerjik";

export interface MuzikParcasi {
  id: string;
  baslik: string;
  sanatci: string;
  kategori: MuzikKategori;
  sure: string;
  /** /public/muzik/ klasöründe bulunan ses dosyası */
  url: string;
  /** CSS gradient için renk çifti */
  renk1: string;
  renk2: string;
  renk3?: string;
  /** SVG dekorasyon tipi */
  desen: "dalgalar" | "halkalar" | "yildizlar" | "notalar" | "kristal" | "soyut";
}

export const KATEGORILER: { id: MuzikKategori | "tumu"; etiket: string }[] = [
  { id: "tumu",     etiket: "Tümü" },
  { id: "romantik", etiket: "Romantik" },
  { id: "klasik",   etiket: "Klasik" },
  { id: "modern",   etiket: "Modern" },
  { id: "enerjik",  etiket: "Enerjik" },
];

export const MUZIK_KUTUPHANESI: MuzikParcasi[] = [
  // ── ROMANTİK ──────────────────────────────────────────────────────
  {
    id: "r1",
    baslik: "Love",
    sanatci: "atlasaudio",
    kategori: "romantik",
    sure: "3:08",
    url: "/muzik/love.mp3",
    renk1: "#7B2D5E",
    renk2: "#C4705A",
    renk3: "#E8A87C",
    desen: "dalgalar",
  },
  {
    id: "r2",
    baslik: "Teaser",
    sanatci: "atlasaudio",
    kategori: "romantik",
    sure: "1:07",
    url: "/muzik/teaser.mp3",
    renk1: "#4A1942",
    renk2: "#C2507A",
    renk3: "#F2A7B8",
    desen: "halkalar",
  },
  {
    id: "r3",
    baslik: "inspirational",
    sanatci: "atlasaudio",
    kategori: "romantik",
    sure: "2:00",
    url: "/muzik/inspirational.mp3",
    renk1: "#1A1F4E",
    renk2: "#4A6FA5",
    renk3: "#A8C5E8",
    desen: "yildizlar",
  },
  {
    id: "r4",
    baslik: "Love Piano",
    sanatci: "atlasaudio",
    kategori: "romantik",
    sure: "2:00",
    url: "/muzik/love-piano.mp3",
    renk1: "#3D1C02",
    renk2: "#C4853A",
    renk3: "#F0C97A",
    desen: "soyut",
  },

  // ── KLASİK ────────────────────────────────────────────────────────
  {
    id: "k1",
    baslik: "The Best Jazz Club In New Orleans",
    sanatci: "PaoloArgento",
    kategori: "klasik",
    sure: "2:00",
    url: "/muzik/the-best-jazz-club-in-new-orleans.mp3",
    renk1: "#0D1B2A",
    renk2: "#1B4F72",
    renk3: "#5B9BD5",
    desen: "notalar",
  },
  {
    id: "k2",
    baslik: "Cooking For Christmas",
    sanatci: "PaoloArgento",
    kategori: "klasik",
    sure: "2:19",
    url: "/muzik/cooking-for-christmas.mp3",
    renk1: "#1A0533",
    renk2: "#6A1F8A",
    renk3: "#B980D4",
    desen: "kristal",
  },
  {
    id: "k3",
    baslik: "Ukulele",
    sanatci: "PaoloArgento",
    kategori: "klasik",
    sure: "2:22",
    url: "/muzik/ukulele-smiles.mp3",
    renk1: "#0D2B1A",
    renk2: "#1E6B45",
    renk3: "#6DC98A",
    desen: "dalgalar",
  },
  {
    id: "k4",
    baslik: "Nature",
    sanatci: "The_Mountain",
    kategori: "klasik",
    sure: "2:18",
    url: "/muzik/nature.mp3",
    renk1: "#2C1810",
    renk2: "#8B4513",
    renk3: "#D4995A",
    desen: "halkalar",
  },

  // ── MODERN ────────────────────────────────────────────────────────
  {
    id: "m1",
    baslik: "Good table with a vibe of helping load i",
    sanatci: "datanetcentre",
    kategori: "modern",
    sure: "4:12",
    url: "/muzik/datanetcentre-good-table-with-a-vibe-of-helping-load-i.mp3",
    renk1: "#0A2240",
    renk2: "#0E5E8A",
    renk3: "#4BC8E8",
    desen: "soyut",
  },
  {
    id: "m2",
    baslik: "From Down Here",
    sanatci: "datanetcentre",
    kategori: "modern",
    sure: "3:59",
    url: "/muzik/from-down-here.mp3",
    renk1: "#1A0020",
    renk2: "#5E1080",
    renk3: "#E040FB",
    desen: "yildizlar",
  },

  // ── ENERJİK ───────────────────────────────────────────────────────
  {
    id: "e1",
    baslik: "Kutlama",
    sanatci: "the_mountain",
    kategori: "enerjik",
    sure: "2:17",
    url: "/muzik/energetic.mp3",
    renk1: "#3D0000",
    renk2: "#C0392B",
    renk3: "#F39C12",
    desen: "kristal",
  },
  {
    id: "e2",
    baslik: "Water",
    sanatci: "kontraa",
    kategori: "enerjik",
    sure: "1:09",
    url: "/muzik/water.mp3",
    renk1: "#1A2F00",
    renk2: "#558B2F",
    renk3: "#C6E900",
    desen: "notalar",
  },
];
