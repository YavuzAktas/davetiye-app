import { prisma } from "@/lib/prisma";

type BildirimTip = "rsvp" | "album" | "ani";

export async function bildirimOlustur({
  userId,
  tip,
  baslik,
  mesaj,
  davetiyeSlug,
}: {
  userId: string;
  tip: BildirimTip;
  baslik: string;
  mesaj: string;
  davetiyeSlug?: string;
}) {
  try {
    await prisma.bildirim.create({
      data: { userId, tip, baslik, mesaj, davetiyeSlug: davetiyeSlug ?? null },
    });
  } catch {
    // Bildirim oluşturma başarısız olsa bile ana işlemi engelleme
  }
}
