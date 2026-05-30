import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: { id: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  const body = await req.json().catch(() => null);
  const { davetliId, katilim, kisiSayisi = 1 } = body ?? {};

  if (!davetliId || typeof katilim !== "boolean") {
    return NextResponse.json({ hata: "Geçersiz veri." }, { status: 400 });
  }

  const davetli = await prisma.davetli.findUnique({
    where: { id: davetliId },
    select: { id: true, ad: true, email: true, rsvpId: true, davetiyeId: true },
  });

  if (!davetli || davetli.davetiyeId !== davetiye.id) {
    return NextResponse.json({ hata: "Davetli bulunamadı." }, { status: 404 });
  }

  const normalKisi = Math.max(1, Math.min(20, Number(kisiSayisi) || 1));

  // Mevcut RSVP varsa güncelle
  if (davetli.rsvpId) {
    await prisma.rSVP.update({
      where: { id: davetli.rsvpId },
      data: { katilim, kisiSayisi: normalKisi },
    });
    return NextResponse.json({ rsvpId: davetli.rsvpId });
  }

  // Yoksa oluştur ve davetliye bağla
  const rsvp = await prisma.rSVP.create({
    data: {
      davetiyeId: davetiye.id,
      ad: davetli.ad,
      email: davetli.email ?? null,
      katilim,
      kisiSayisi: normalKisi,
    },
  });

  await prisma.davetli.update({
    where: { id: davetliId },
    data: { rsvpId: rsvp.id },
  });

  return NextResponse.json({ rsvpId: rsvp.id });
}
