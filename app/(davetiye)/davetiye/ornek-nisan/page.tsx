import NisanLuksSablon from "@/components/sablonlar/NisanLuksSablon";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";

export const metadata = {
  title: "Lüks Nişan Davetiyesi — Örnek",
  description: "Bordo & altın temalı gül mühürlü dijital nişan davetiyesi önizlemesi.",
  robots: {
    index: false,
    follow: true,
  },
};

const ORNEK: DavetiyeVeri = {
  id: "ornek-nisan",
  slug: "ornek-nisan",
  baslik: "Zeynep & Kaan Nişan",
  etkinlikTur: "nisan",
  tarih: new Date("2026-07-19T18:30:00"),
  mekan: "Çırağan Palace Kempinski, İstanbul",
  mesaj: "Hayatımızın en özel gününü sizlerle kutlamaktan büyük mutluluk duyacağız. Varlığınız bu anı daha da güzel kılacak.",
  sablon: "nisan-luks",
  ozelRenk: null,
  font: null,
  muzik: "/muzik/love.mp3",
  goruntulenme: 0,
  user: { name: "Zeynep Arslan", email: null },
  kisi1: "Zeynep Arslan",
  kisi2: "Kaan Yıldız",
  albumAktif: true,
  polaroid1: null,
  polaroid2: null,
  polaroid3: null,
  sesliAniAktif: false,
  canliDuvarAktif: false,
  aniDefteriAktif: false,
  dressKod: "Şık / Kokteyl",
  dressKodRenkler: JSON.stringify(["#6B0F1A", "#C4A05A", "#2C0A16", "#D4B896", "#F5EFE6"]),
};

export default function OrnekNisanSayfasi() {
  return <NisanLuksSablon davetiye={ORNEK} rsvpBileseni={null} />;
}
