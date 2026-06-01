import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import type { Metadata } from "next";
import FotoSecimi from "./FotoSecimi";

interface Props { params: Promise<{ slug: string }> }

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function FotoSecimiSayfasi({ params }: Props) {
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    select: {
      id: true,
      baslik: true,
      aktif: true,
      odemeDurumu: true,
      albumAktif: true,
    },
  });

  if (!davetiye || !davetiye.aktif) notFound();
  if (!davetiyeOzelligiAktif(davetiye, "album")) notFound();

  const fotolar = await prisma.albumFoto.findMany({
    where: { davetiyeId: davetiye.id, onaylandi: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, yukleyenAd: true, dosyaUrl: true, oylamaSayisi: true },
  });

  return <FotoSecimi slug={slug} baslik={davetiye.baslik} baslangicFotolar={fotolar} />;
}
