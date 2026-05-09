import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function masaYetki(slug: string, masaId: string, email: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return null;
  const d = await prisma.davetiye.findUnique({ where: { slug }, select: { id: true, userId: true } });
  if (!d || d.userId !== user.id) return null;
  const masa = await prisma.masa.findUnique({ where: { id: masaId } });
  if (!masa || masa.davetiyeId !== d.id) return null;
  return masa;
}

interface Params { params: Promise<{ slug: string; masaId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  const { slug, masaId } = await params;
  const masa = await masaYetki(slug, masaId, session.user.email);
  if (!masa) return NextResponse.json({ hata: "Bulunamadı" }, { status: 404 });

  const { isim, kapasite } = await req.json();
  const updated = await prisma.masa.update({
    where: { id: masaId },
    data: {
      ...(isim !== undefined && { isim: String(isim).trim() }),
      ...(kapasite !== undefined && { kapasite: Number(kapasite) }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  const { slug, masaId } = await params;
  const masa = await masaYetki(slug, masaId, session.user.email);
  if (!masa) return NextResponse.json({ hata: "Bulunamadı" }, { status: 404 });

  await prisma.masa.delete({ where: { id: masaId } });
  return NextResponse.json({ basarili: true });
}
