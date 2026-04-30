import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ── Yardımcı: davetiyenin mevcut kullanıcıya ait olup olmadığını doğrula */
async function sahiplikDogrula(davetiyeId: string, userId: string) {
  const davetiye = await prisma.davetiye.findUnique({
    where: { id: davetiyeId },
    select: { userId: true },
  });
  return davetiye?.userId === userId;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const davetiyeId = new URL(req.url).searchParams.get("davetiyeId");
  if (!davetiyeId) {
    return NextResponse.json({ hata: "davetiyeId gerekli." }, { status: 400 });
  }

  if (!await sahiplikDogrula(davetiyeId, session.user.id)) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  const davetliler = await prisma.davetli.findMany({
    where: { davetiyeId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ davetliler });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const { davetiyeId, davetliler } = await req.json();

  if (!davetiyeId || !Array.isArray(davetliler) || davetliler.length === 0) {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }

  if (!await sahiplikDogrula(davetiyeId, session.user.id)) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  const yeniDavetliler = await prisma.davetli.createMany({
    data: davetliler.map((d: { ad: string; telefon?: string; email?: string }) => ({
      davetiyeId,
      ad:      d.ad,
      telefon: d.telefon || null,
      email:   d.email   || null,
    })),
  });

  return NextResponse.json({ basarili: true, count: yeniDavetliler.count });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ hata: "id gerekli." }, { status: 400 });

  // Davetlinin hangi davetiyeye ait olduğunu ve o davetiyenin
  // session kullanıcısına ait olduğunu tek sorguda doğrula
  const davetli = await prisma.davetli.findUnique({
    where: { id },
    select: { davetiye: { select: { userId: true } } },
  });

  if (!davetli || davetli.davetiye.userId !== session.user.id) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  await prisma.davetli.delete({ where: { id } });
  return NextResponse.json({ basarili: true });
}
