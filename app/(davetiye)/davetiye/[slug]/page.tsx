import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getSablonTipi } from "@/lib/sablon-registry";
import { KlasikSablon, NisanLuksSablon, DugunLuksSablon, DogumGunuLuksSablon } from "@/components/sablonlar";
import RsvpForm from "@/components/RsvpForm";
import EtkilesimButonu from "@/components/EtkilesimButonu";
import DavetiyeGoruntulenmeKaydedici from "@/components/DavetiyeGoruntulenmeKaydedici";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import { davetiyeCacheTag } from "@/lib/cache-tags";
import BeklerizWatermark from "@/components/BeklerizWatermark";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

function publicDavetiyeGetir(slug: string) {
  return unstable_cache(
    async () => prisma.davetiye.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        baslik: true,
        etkinlikTur: true,
        tarih: true,
        mekan: true,
        mesaj: true,
        sablon: true,
        ozelRenk: true,
        font: true,
        muzik: true,
        kisi1: true,
        kisi2: true,
        polaroid1: true,
        polaroid2: true,
        polaroid3: true,
        sesliAniAktif: true,
        canliDuvarAktif: true,
        dressKod: true,
        dressKodRenkler: true,
        albumAktif: true,
        aktif: true,
        odemeDurumu: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    ["public-davetiye", slug],
    { revalidate, tags: [davetiyeCacheTag(slug)] },
  )();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const davetiye = await publicDavetiyeGetir(slug);
  if (!davetiye) {
    return {
      title: "Davetiye Bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: davetiye.baslik,
    robots: { index: false, follow: false },
  };
}

export default async function DavetiyeSayfasi({ params }: Props) {
  const { slug } = await params;

  const davetiye = await publicDavetiyeGetir(slug);

  if (!davetiye || !davetiye.aktif) notFound();

  const sablonTipi = getSablonTipi(davetiye.sablon);

  /* Davetiye şablonunun tema rengi (FloatingButton için) */
  const TEMA_RENKLER: Record<string, string> = {
    "nisan-luks":     "#C4A05A",
    "dugun-luks":     "#D4AA70",
    "dogumgunu-luks": "#D4A84B",
  };
  const temaRenk = TEMA_RENKLER[sablonTipi] ?? "#7C3AED";

  const albumAktif      = davetiyeOzelligiAktif(davetiye, "album");
  const sesliAniAktif   = davetiyeOzelligiAktif(davetiye, "sesliAni");
  const canliDuvarAktif = davetiyeOzelligiAktif(davetiye, "canliDuvar");

  const veri: DavetiyeVeri = {
    id: davetiye.id,
    slug: davetiye.slug,
    baslik: davetiye.baslik,
    etkinlikTur: davetiye.etkinlikTur,
    tarih: davetiye.tarih,
    mekan: davetiye.mekan,
    mesaj: davetiye.mesaj,
    sablon: davetiye.sablon,
    ozelRenk: davetiye.ozelRenk ?? null,
    font: davetiye.font ?? null,
    muzik: davetiye.muzik,
    goruntulenme: 0,
    user: {
      name: davetiye.user?.name ?? null,
      email: davetiye.user?.email ?? null,
    },
    kisi1: davetiye.kisi1 ?? null,
    kisi2: davetiye.kisi2 ?? null,
    albumAktif,
    polaroid1: davetiye.polaroid1 ?? null,
    polaroid2: davetiye.polaroid2 ?? null,
    polaroid3: davetiye.polaroid3 ?? null,
    sesliAniAktif,
    canliDuvarAktif,
    dressKod: davetiye.dressKod ?? null,
    dressKodRenkler: davetiye.dressKodRenkler ?? null,
  };

  const rsvpBileseni = (
    <RsvpForm
      davetiyeId={davetiye.id}
      renk={temaRenk}
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
      <DavetiyeGoruntulenmeKaydedici slug={davetiye.slug} />
      {sablon}
      <BeklerizWatermark />
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
