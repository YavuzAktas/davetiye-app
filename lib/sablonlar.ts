export type Sablon = {
  id: string;
  isim: string;
  kategori: "dugun" | "nisan" | "dogumgunu" | "sunnet" | "kina" | "diger";
  renk: string;
  arkaplan: string;
  yaziRengi: string;
};

export const SABLONLAR: Sablon[] = [
  {
    id: "klasik-dugun",
    isim: "Klasik Düğün",
    kategori: "dugun",
    renk: "#7C3AED",
    arkaplan: "from-purple-50 to-white",
    yaziRengi: "#1F2937",
  },
  {
    id: "romantik-dugun",
    isim: "Romantik Düğün",
    kategori: "dugun",
    renk: "#DB2777",
    arkaplan: "from-pink-50 to-white",
    yaziRengi: "#1F2937",
  },
  {
    id: "modern-nisan",
    isim: "Modern Nişan",
    kategori: "nisan",
    renk: "#0891B2",
    arkaplan: "from-cyan-50 to-white",
    yaziRengi: "#1F2937",
  },
  {
    id: "eglenceli-dogumgunu",
    isim: "Eğlenceli Doğum Günü",
    kategori: "dogumgunu",
    renk: "#D97706",
    arkaplan: "from-amber-50 to-white",
    yaziRengi: "#1F2937",
  },
  {
    id: "sade-dogumgunu",
    isim: "Sade Doğum Günü",
    kategori: "dogumgunu",
    renk: "#059669",
    arkaplan: "from-emerald-50 to-white",
    yaziRengi: "#1F2937",
  },
  {
    id: "geleneksel-sunnet",
    isim: "Geleneksel Sünnet",
    kategori: "sunnet",
    renk: "#1D4ED8",
    arkaplan: "from-blue-50 to-white",
    yaziRengi: "#1F2937",
  },
];

export const KATEGORILER = [
  { id: "hepsi", isim: "Hepsi" },
  { id: "dugun", isim: "Düğün" },
  { id: "nisan", isim: "Nişan" },
  { id: "dogumgunu", isim: "Doğum Günü" },
  { id: "sunnet", isim: "Sünnet" },
  { id: "kina", isim: "Kına" },
  { id: "diger", isim: "Diğer" },
];