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
    baslik: "Serenat",
    sanatci: "Enstrümantal",
    kategori: "romantik",
    sure: "3:42",
    url: "/muzik/romantik-serenat.mp3",
    renk1: "#7B2D5E",
    renk2: "#C4705A",
    renk3: "#E8A87C",
    desen: "dalgalar",
  },
  {
    id: "r2",
    baslik: "Gül Bahçesi",
    sanatci: "Yaylı Dörtlüsü",
    kategori: "romantik",
    sure: "4:15",
    url: "/muzik/romantik-gul-bahcesi.mp3",
    renk1: "#4A1942",
    renk2: "#C2507A",
    renk3: "#F2A7B8",
    desen: "halkalar",
  },
  {
    id: "r3",
    baslik: "Ay Işığı",
    sanatci: "Piyano Solo",
    kategori: "romantik",
    sure: "3:58",
    url: "/muzik/romantik-ay-isigi.mp3",
    renk1: "#1A1F4E",
    renk2: "#4A6FA5",
    renk3: "#A8C5E8",
    desen: "yildizlar",
  },
  {
    id: "r4",
    baslik: "Sonsuzluk",
    sanatci: "Oda Orkestrası",
    kategori: "romantik",
    sure: "5:03",
    url: "/muzik/romantik-sonsuzluk.mp3",
    renk1: "#3D1C02",
    renk2: "#C4853A",
    renk3: "#F0C97A",
    desen: "soyut",
  },

  // ── KLASİK ────────────────────────────────────────────────────────
  {
    id: "k1",
    baslik: "Nocturne",
    sanatci: "Piyano",
    kategori: "klasik",
    sure: "4:28",
    url: "/muzik/klasik-nocturne.mp3",
    renk1: "#0D1B2A",
    renk2: "#1B4F72",
    renk3: "#5B9BD5",
    desen: "notalar",
  },
  {
    id: "k2",
    baslik: "Keman Sonatı",
    sanatci: "Keman & Piyano",
    kategori: "klasik",
    sure: "5:17",
    url: "/muzik/klasik-keman-sonati.mp3",
    renk1: "#1A0533",
    renk2: "#6A1F8A",
    renk3: "#B980D4",
    desen: "kristal",
  },
  {
    id: "k3",
    baslik: "Bahar Bahçesi",
    sanatci: "Flüt & Yaylılar",
    kategori: "klasik",
    sure: "3:51",
    url: "/muzik/klasik-bahar-bahcesi.mp3",
    renk1: "#0D2B1A",
    renk2: "#1E6B45",
    renk3: "#6DC98A",
    desen: "dalgalar",
  },
  {
    id: "k4",
    baslik: "Menuet",
    sanatci: "Yaylı Dörtlüsü",
    kategori: "klasik",
    sure: "2:44",
    url: "/muzik/klasik-menuet.mp3",
    renk1: "#2C1810",
    renk2: "#8B4513",
    renk3: "#D4995A",
    desen: "halkalar",
  },

  // ── MODERN ────────────────────────────────────────────────────────
  {
    id: "m1",
    baslik: "Yeni Başlangıç",
    sanatci: "Ambient",
    kategori: "modern",
    sure: "4:02",
    url: "/muzik/modern-yeni-baslangic.mp3",
    renk1: "#0A2240",
    renk2: "#0E5E8A",
    renk3: "#4BC8E8",
    desen: "soyut",
  },
  {
    id: "m2",
    baslik: "Şehir Işıkları",
    sanatci: "Neo-Soul",
    kategori: "modern",
    sure: "3:34",
    url: "/muzik/modern-sehir-isiklari.mp3",
    renk1: "#1A0020",
    renk2: "#5E1080",
    renk3: "#E040FB",
    desen: "yildizlar",
  },

  // ── ENERJİK ───────────────────────────────────────────────────────
  {
    id: "e1",
    baslik: "Kutlama",
    sanatci: "Orkestra",
    kategori: "enerjik",
    sure: "3:18",
    url: "/muzik/enerjik-kutlama.mp3",
    renk1: "#3D0000",
    renk2: "#C0392B",
    renk3: "#F39C12",
    desen: "kristal",
  },
  {
    id: "e2",
    baslik: "Dans Gecesi",
    sanatci: "Big Band",
    kategori: "enerjik",
    sure: "4:45",
    url: "/muzik/enerjik-dans-gecesi.mp3",
    renk1: "#1A2F00",
    renk2: "#558B2F",
    renk3: "#C6E900",
    desen: "notalar",
  },
];
