import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ slug: string }> }

async function davetiyeYetki(slug: string, email: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return null;
  const d = await prisma.davetiye.findUnique({ where: { slug }, select: { id: true, userId: true } });
  if (!d || d.userId !== user.id) return null;
  return { davetiyeId: d.id };
}

// POST: assign or reassign (masaId=null → unassign)
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  const { slug } = await params;
  const yetki = await davetiyeYetki(slug, session.user.email);
  if (!yetki) return NextResponse.json({ hata: "Bulunamadı" }, { status: 404 });

  const { rsvpId, masaId } = await req.json();
  if (!rsvpId) return NextResponse.json({ hata: "rsvpId gerekli" }, { status: 400 });

  if (!masaId) {
    // Unassign
    await prisma.masaAtama.deleteMany({ where: { rsvpId } });
    return NextResponse.json({ basarili: true });
  }

  // Verify masa belongs to this davetiye
  const masa = await prisma.masa.findUnique({ where: { id: masaId } });
  if (!masa || masa.davetiyeId !== yetki.davetiyeId) {
    return NextResponse.json({ hata: "Masa bulunamadı" }, { status: 404 });
  }

  // Upsert assignment
  await prisma.masaAtama.upsert({
    where: { rsvpId },
    create: { rsvpId, masaId },
    update: { masaId },
  });

  return NextResponse.json({ basarili: true });
}
