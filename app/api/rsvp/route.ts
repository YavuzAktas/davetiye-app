import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { davetiyeId, ad, email, telefon, katilim, kisiSayisi, not } = body;

  if (!davetiyeId || !ad || katilim === undefined) {
    return NextResponse.json(
      { hata: "Zorunlu alanlar eksik." },
      { status: 400 }
    );
  }

  const davetiye = await prisma.davetiye.findUnique({
    where: { id: davetiyeId },
  });

  if (!davetiye) {
    return NextResponse.json(
      { hata: "Davetiye bulunamadı." },
      { status: 404 }
    );
  }

  const rsvp = await prisma.rSVP.create({
    data: {
      davetiyeId,
      ad,
      email: email || null,
      telefon: telefon || null,
      katilim,
      kisiSayisi: kisiSayisi || 1,
      not: not || null,
    },
  });

  return NextResponse.json({ basarili: true, rsvp });
}