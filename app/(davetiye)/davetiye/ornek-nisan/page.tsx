import NisanLuksSablon from "@/components/sablonlar/NisanLuksSablon";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";
import BeklerizWatermark from "@/components/BeklerizWatermark";

export const metadata = {
  title: "Lüks Nişan Davetiyesi — Örnek",
  description: "Bordo & altın temalı gül mühürlü dijital nişan davetiyesi önizlemesi.",
  robots: {
    index: false,
    follow: true,
  },
};

const ORNEK: DavetiyeVeri = {
  id: "ornek",
  slug: "ornek-nisan",
  baslik: "Aylin & Yavuz Nişan",
  etkinlikTur: "nisan",
  tarih: new Date("2026-06-06T18:00:00"),
  mekan: "Çırağan Sarayı, İstanbul",
  mesaj: "Bizi bu özel günde yanımızda görmek isteriz",
  sablon: "nisan-luks",
  ozelRenk: null,
  font: null,
  muzik: "/muzik/love.mp3",
  goruntulenme: 0,
  user: { name: "Aylin Yılmaz", email: null },
  kisi1: "Aylin",
  kisi2: "Yavuz",
  albumAktif: true,
  polaroid1: null,
  polaroid2: null,
  polaroid3: null,
  sesliAniAktif: false,
  canliDuvarAktif: false,
  aniDefteriAktif: false,
  dressKod: null,
  dressKodRenkler: null,
};

export default function OrnekNisanSayfasi() {
  return <>
    <NisanLuksSablon davetiye={ORNEK} rsvpBileseni={null} />
    <BeklerizWatermark />
  </>;
}
