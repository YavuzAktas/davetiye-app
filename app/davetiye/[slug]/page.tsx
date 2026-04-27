import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSablonTipi } from "@/lib/sablon-registry";
import { KlasikSablon } from "@/components/sablonlar";
import { NisanLuksSablon } from "@/components/sablonlar";
import RsvpForm from "@/components/RsvpForm";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";

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
  };

  const rsvpBileseni = <RsvpForm davetiyeId={davetiye.id} renk="#7C3AED" />;

  if (sablonTipi === "nisan-luks") {
    return <NisanLuksSablon davetiye={veri} rsvpBileseni={rsvpBileseni} />;
  }

  return <KlasikSablon davetiye={veri} rsvpBileseni={rsvpBileseni} />;
}