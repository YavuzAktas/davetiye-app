import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getSablonTipi } from "@/lib/sablon-registry";
import { KlasikSablon, NisanLuksSablon, DugunLuksSablon, DogumGunuLuksSablon, VintageNisanSablon } from "@/components/sablonlar";
import RsvpForm from "@/components/RsvpForm";
import EtkilesimButonu from "@/components/EtkilesimButonu";
import DavetiyeGoruntulenmeKaydedici from "@/components/DavetiyeGoruntulenmeKaydedici";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import { davetiyeCacheTag } from "@/lib/cache-tags";
import DavetRotaWatermark from "@/components/DavetRotaWatermark";
import EtkilesimButonuBekle from "./EtkilesimButonuBekle";
import { type RsvpSorular } from "@/lib/rsvp-sorular";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ dk?: string }>;
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
        aniDefteriAktif: true,
        dressKod: true,
        dressKodRenkler: true,
        albumAktif: true,
        aktif: true,
        odemeDurumu: true,
        rsvpSorular: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        etkinlikProgrami: {
          orderBy: { sira: "asc" },
          select: { id: true, isim: true, tarih: true, saat: true, mekan: true, aciklama: true, ikon: true, sira: true },
        },
      },
    }),
    ["public-davetiye", slug],
    { revalidate, tags: [davetiyeCacheTag(slug)] },
  )();
}

const ETKINLIK_ETIKET: Record<string, string> = {
  dugun: "Düğün Davetiyesi", nisan: "Nişan Davetiyesi",
  dogumgunu: "Doğum Günü Davetiyesi", sunnet: "Sünnet Davetiyesi",
  kina: "Kına Davetiyesi", kurumsal: "Etkinlik Davetiyesi", diger: "Davetiye",
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const davetiye = await publicDavetiyeGetir(slug);
  if (!davetiye) {
    return {
      title: "Davetiye Bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const etiket = ETKINLIK_ETIKET[davetiye.etkinlikTur] ?? "Davetiye";
  const tarihStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    : null;

  const descParcalar: string[] = [];
  if (tarihStr) descParcalar.push(tarihStr);
  if (davetiye.mekan) descParcalar.push(davetiye.mekan);
  descParcalar.push("Davetiyeyi görüntülemek için tıklayın.");

  const description = descParcalar.join(" · ");
  const title = `${davetiye.baslik} | ${etiket}`;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function DavetiyeSayfasi({ params, searchParams }: Props) {
  const { slug } = await params;
  const { dk } = await searchParams;

  const davetiye = await publicDavetiyeGetir(slug);

  if (!davetiye || !davetiye.aktif) notFound();

  /* Kişisel link varsa davetli verisini çek (önbelleksiz) */
  let davetliOnAd: string | null = null;
  let davetliMaxKisi: number | null = null;
  if (dk) {
    const davetli = await prisma.davetli.findUnique({
      where: { ozelKod: dk },
      select: { ad: true, kisiLimiti: true, davetiyeId: true },
    });
    if (davetli && davetli.davetiyeId === davetiye.id) {
      davetliOnAd  = davetli.ad;
      davetliMaxKisi = davetli.kisiLimiti;
    }
  }

  const sablonTipi = getSablonTipi(davetiye.sablon);

  /* Davetiye şablonunun tema rengi (FloatingButton için) */
  const TEMA_RENKLER: Record<string, string> = {
    "nisan-luks":     "#C4A05A",
    "dugun-luks":     "#D4AA70",
    "dogumgunu-luks": "#D4A84B",
    "vintage-nisan":  "#C9A840",
  };
  const temaRenk = TEMA_RENKLER[sablonTipi] ?? "#7C3AED";

  const albumAktif      = davetiyeOzelligiAktif(davetiye, "album");
  const aniDefteriAktif = davetiyeOzelligiAktif(davetiye, "aniDefteri");
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
    aniDefteriAktif,
    sesliAniAktif,
    canliDuvarAktif,
    dressKod: davetiye.dressKod ?? null,
    dressKodRenkler: davetiye.dressKodRenkler ?? null,
  };

  const programEtkinlikleri = (davetiye.etkinlikProgrami ?? []).map(e => ({
    id:       e.id,
    isim:     e.isim,
    tarih:    e.tarih ? new Date(e.tarih).toISOString() : null,
    saat:     e.saat,
    mekan:    e.mekan,
    aciklama: e.aciklama,
    ikon:     e.ikon,
    sira:     e.sira,
  }));

  const rsvpBileseni = (
    <RsvpForm
      davetiyeId={davetiye.id}
      renk={temaRenk}
      etkinlikler={programEtkinlikleri}
      rsvpSorular={(davetiye.rsvpSorular as RsvpSorular | null) ?? null}
      onAd={davetliOnAd}
      maxKisiSayisi={davetliMaxKisi}
      davetliKod={dk ?? null}
    />
  );

  let sablon: React.ReactNode;
  if (sablonTipi === "vintage-nisan") {
    sablon = <VintageNisanSablon davetiye={veri} rsvpBileseni={rsvpBileseni} />;
  } else if (sablonTipi === "nisan-luks") {
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
      {!["vintage-nisan", "nisan-luks"].includes(sablonTipi) && <DavetRotaWatermark />}
      {sablonTipi === "nisan-luks" ? (
        <EtkilesimButonuBekle
          slug={davetiye.slug}
          renk={temaRenk}
          albumAktif={albumAktif}
          aniDefteriAktif={aniDefteriAktif}
          canliDuvarAktif={canliDuvarAktif}
          sesliAniAktif={sesliAniAktif}
        />
      ) : (
        <EtkilesimButonu
          slug={davetiye.slug}
          renk={temaRenk}
          albumAktif={albumAktif}
          aniDefteriAktif={aniDefteriAktif}
          canliDuvarAktif={canliDuvarAktif}
          sesliAniAktif={sesliAniAktif}
        />
      )}
    </>
  );
}
