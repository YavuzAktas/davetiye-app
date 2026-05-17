"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeFiyatiHesapla } from "@/lib/davetiye-fiyatlandirma";
import { revalidatePath } from "next/cache";

const DB_ALANI: Record<string, string> = {
  "album-ani":     "albumAktif",
  "sesli-ani":     "sesliAniAktif",
  "canli-duvar":   "canliDuvarAktif",
  "oturma-plani":  "oturmaPlanAktif",
};

export async function upsellOzellikEkle(davetiyeId: string, ozellikKod: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Yetkisiz");

  const alan = DB_ALANI[ozellikKod];
  if (!alan) throw new Error("Geçersiz özellik");

  const davetiye = await prisma.davetiye.findFirst({
    where: { id: davetiyeId, user: { email: session.user.email } },
    select: { id: true, slug: true },
  });
  if (!davetiye) throw new Error("Davetiye bulunamadı");

  const guncellendi = await prisma.davetiye.update({
    where: { id: davetiyeId },
    data: { [alan]: true },
    select: {
      sablon: true, muzik: true,
      albumAktif: true, sesliAniAktif: true,
      canliDuvarAktif: true, oturmaPlanAktif: true,
    },
  });

  const yeniFiyat = davetiyeFiyatiHesapla({
    sablon:          guncellendi.sablon,
    muzik:           guncellendi.muzik,
    albumAktif:      guncellendi.albumAktif,
    sesliAniAktif:   guncellendi.sesliAniAktif,
    canliDuvarAktif: guncellendi.canliDuvarAktif,
    oturmaPlanAktif: guncellendi.oturmaPlanAktif,
  });

  await prisma.davetiye.update({
    where: { id: davetiyeId },
    data: { fiyatSnapshot: yeniFiyat as never },
  });

  revalidatePath(`/odeme/${davetiye.slug}`);
}
