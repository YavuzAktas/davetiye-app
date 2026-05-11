export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSablonTipi } from "@/lib/sablon-registry";
import { KlasikSablon, NisanLuksSablon, DugunLuksSablon, DogumGunuLuksSablon } from "@/components/sablonlar";
import RsvpForm from "@/components/RsvpForm";
import EtkilesimButonu from "@/components/EtkilesimButonu";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";
import { planOzellikVar } from "@/lib/planlar";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const davetiye = await prisma.davetiye.findUnique({ where: { slug } });
  if (!davetiye) return { title: "Davetiye Bulunamadı" };
  return { title: davetiye.baslik };
}

export default async function DavetiyeSayfasi({ params }: Props) {
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    include: { user: true },
  });

  if (!davetiye || !davetiye.aktif) notFound();

  await prisma.davetiye.update({
    where: { slug },
    data: { goruntulenme: { increment: 1 } },
  });

  const sablonTipi = getSablonTipi(davetiye.sablon);

  /* Davetiye şablonunun tema rengi (FloatingButton için) */
  const TEMA_RENKLER: Record<string, string> = {
    "nisan-luks":     "#C4A05A",
    "dugun-luks":     "#D4AA70",
    "dogumgunu-luks": "#D4A84B",
  };
  const temaRenk = TEMA_RENKLER[sablonTipi] ?? "#7C3AED";

  const spotifyAktif    = (davetiye as any).spotifyAktif ?? false;
  const albumAktif      = planOzellikVar(davetiye.user?.plan ?? "free", "album");
  const sesliAniAktif   = (davetiye as any).sesliAniAktif  ?? false;
  const canliDuvarAktif = (davetiye as any).canliDuvarAktif ?? false;

  const veri: DavetiyeVeri = {
    id: davetiye.id,
    slug: davetiye.slug,
    baslik: davetiye.baslik,
    etkinlikTur: davetiye.etkinlikTur,
    tarih: davetiye.tarih,
    mekan: davetiye.mekan,
    mesaj: davetiye.mesaj,
    sablon: davetiye.sablon,
    ozelRenk: (davetiye as any).ozelRenk ?? null,
    font: (davetiye as any).font ?? null,
    muzik: davetiye.muzik,
    goruntulenme: davetiye.goruntulenme,
    user: {
      name: davetiye.user?.name ?? null,
      email: davetiye.user?.email ?? null,
    },
    kisi1: (davetiye as any).kisi1 ?? null,
    kisi2: (davetiye as any).kisi2 ?? null,
    spotifyAktif,
    albumAktif,
    polaroid1: (davetiye as any).polaroid1 ?? null,
    polaroid2: (davetiye as any).polaroid2 ?? null,
    polaroid3: (davetiye as any).polaroid3 ?? null,
    sesliAniAktif,
    canliDuvarAktif,
    dressKod: (davetiye as any).dressKod ?? null,
    dressKodRenkler: (davetiye as any).dressKodRenkler ?? null,
  };

  const rsvpBileseni = (
    <RsvpForm
      davetiyeId={davetiye.id}
      renk={temaRenk}
      spotifyAktif={spotifyAktif}
    />
  );

  let sablon: React.ReactNode;
  if (sablonTipi === "nisan-luks") {
    sablon = <NisanLuksSablon davetiye={veri} rsvpBileseni={rsvpBileseni} />;
  } else if (sablonTipi === "dugun-luks") {
    sablon = <DugunLuksSablon davetiye={veri} rsvpBileseni={rsvpBileseni} />;
  } else if (sablonTipi === "dogumgunu-luks") {
    sablon = <DogumGunuLuksSablon davetiye={veri} rsvpBileseni={rsvpBileseni} />;
  } else {
    sablon = <KlasikSablon davetiye={veri} rsvpBileseni={rsvpBileseni} />;
  }

  return (
    <>
      {sablon}
      <EtkilesimButonu
        slug={davetiye.slug}
        renk={temaRenk}
        albumAktif={albumAktif}
        canliDuvarAktif={canliDuvarAktif}
        sesliAniAktif={sesliAniAktif}
      />
    </>
  );
}
