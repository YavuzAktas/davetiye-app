import VintageNisanSablon from "@/components/sablonlar/VintageNisanSablon";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";

export const metadata = {
  title: "Vintage Nişan Davetiyesi — Örnek",
  description: "Krem & bordo temalı botanik çiçekli vintage romantik dijital nişan davetiyesi önizlemesi.",
  robots: {
    index: false,
    follow: true,
  },
};

const ORNEK: DavetiyeVeri = {
  id: "ornek-vintage",
  slug: "ornek-vintage-nisan",
  baslik: "Selin & Emre Nişan",
  etkinlikTur: "nisan",
  tarih: new Date("2026-07-12T18:30:00"),
  mekan: "Swissôtel The Bosphorus, İstanbul",
  mesaj: "Hayatımızın en güzel gününde sizi yanımızda görmek, bu anı sizinle paylaşmak bizi çok mutlu edecek.",
  sablon: "vintage-nisan",
  ozelRenk: null,
  font: null,
  muzik: null,
  goruntulenme: 0,
  user: { name: "Selin Kaya", email: null },
  kisi1: "Selin Kaya",
  kisi2: "Emre Demir",
  albumAktif: true,
  polaroid1: null,
  polaroid2: null,
  polaroid3: null,
  sesliAniAktif: false,
  canliDuvarAktif: false,
  aniDefteriAktif: false,
  dressKod: "Şık / Kokteyl",
  dressKodRenkler: JSON.stringify(["#6E1C2A", "#C49A6C", "#3D2219", "#8B4C36", "#F7F0E4"]),
};

export default function OrnekVintageNisanSayfasi() {
  return <>
    <VintageNisanSablon davetiye={ORNEK} rsvpBileseni={null} />
  </>;
}
