import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";

interface Params { params: Promise<{ slug: string }> }

async function davetiyeYetki(slug: string, email: string) {
  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email } },
    select: { id: true, odemeDurumu: true, oturmaPlanAktif: true, user: { select: { plan: true } } },
  });
  return davetiye && davetiyeOzelligiAktif(davetiye, "oturmaPlan") ? { davetiyeId: davetiye.id } : null;
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });

  const { slug } = await params;
  const yetki = await davetiyeYetki(slug, session.user.email);
  if (!yetki) return NextResponse.json({ hata: "Bu davetiyede oturma planı aktif değil." }, { status: 403 });

  const { rsvpId, masaId } = await req.json();
  if (!rsvpId) return NextResponse.json({ hata: "rsvpId gerekli" }, { status: 400 });

  const rsvp = await prisma.rSVP.findFirst({
    where: { id: rsvpId, davetiyeId: yetki.davetiyeId, katilim: true },
    select: { id: true },
  });
  if (!rsvp) return NextResponse.json({ hata: "Misafir bulunamadı" }, { status: 404 });

  if (!masaId) {
    await prisma.masaAtama.deleteMany({ where: { rsvpId } });
    return NextResponse.json({ basarili: true });
  }

  const masa = await prisma.masa.findFirst({
    where: { id: masaId, davetiyeId: yetki.davetiyeId },
    select: { id: true },
  });
  if (!masa) {
    return NextResponse.json({ hata: "Masa bulunamadı" }, { status: 404 });
  }

  await prisma.masaAtama.upsert({
    where: { rsvpId },
    create: { rsvpId, masaId },
    update: { masaId },
  });

  return NextResponse.json({ basarili: true });
}
