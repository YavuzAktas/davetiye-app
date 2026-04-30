import { DogumGunuLuksSablon } from "@/components/sablonlar";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";

export const metadata = {
  title: "Lüks Doğum Günü Davetiyesi — Örnek",
  description: "Derin mor & şampanya altın temalı pasta mühürlü lüks doğum günü davetiyesi önizlemesi.",
};

const ORNEK: DavetiyeVeri = {
  id: "ornek",
  slug: "ornek-dogumgunu",
  baslik: "Zeynep'in 30. Doğum Günü",
  etkinlikTur: "dogumgunu",
  tarih: new Date("2026-08-15T20:00:00"),
  mekan: "Çırağan Palace, İstanbul",
  mesaj: "Bu özel gecede sizinle kutlamak istiyorum",
  sablon: "dogumgunu-luks",
  ozelRenk: null,
  font: null,
  muzik: null,
  goruntulenme: 0,
  user: { name: "Zeynep Arslan", email: null },
  kisi1: "Zeynep",
  kisi2: null,
};

export default function OrnekDogumGunuSayfasi() {
  return <DogumGunuLuksSablon davetiye={ORNEK} rsvpBileseni={null} />;
}
