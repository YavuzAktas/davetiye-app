import { DugunLuksSablon } from "@/components/sablonlar";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";

export const metadata = {
  title: "Lüks Düğün Davetiyesi — Örnek",
  description: "Lacivert & şampanya altın temalı düğün yüzüğü mühürlü dijital düğün davetiyesi önizlemesi.",
};

const ORNEK: DavetiyeVeri = {
  id: "ornek",
  slug: "ornek-dugun",
  baslik: "Selin & Mert Düğünü",
  etkinlikTur: "dugun",
  tarih: new Date("2026-09-12T19:00:00"),
  mekan: "Four Seasons Bosphorus, İstanbul",
  mesaj: "Bu mutlu günümüzü sizinle paylaşmaktan büyük mutluluk duyuyoruz",
  sablon: "dugun-luks",
  ozelRenk: null,
  font: null,
  muzik: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  goruntulenme: 0,
  user: { name: "Selin Yıldız", email: null },
  kisi1: "Selin",
  kisi2: "Mert",
};

export default function OrnekDugunSayfasi() {
  return <DugunLuksSablon davetiye={ORNEK} rsvpBileseni={null} />;
}
