import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import type { Metadata } from "next";
import CanliDuvarGorunumu from "./CanliDuvarGorunumu";

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CanliDuvarSayfasi({ params }: Props) {
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    select: {
      slug: true,
      baslik: true,
      tarih: true,
      aktif: true,
      odemeDurumu: true,
      canliDuvarAktif: true,
    },
  });

  if (!davetiye || !davetiye.aktif) notFound();
  if (!davetiyeOzelligiAktif(davetiye, "canliDuvar")) notFound();

  const tarihStr = davetiye.tarih
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Istanbul",
      }).format(new Date(davetiye.tarih))
    : null;

  return (
    <CanliDuvarGorunumu
      slug={slug}
      baslik={davetiye.baslik}
      tarihStr={tarihStr}
    />
  );
}
