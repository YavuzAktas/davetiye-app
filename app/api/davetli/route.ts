import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const davetiyeId = searchParams.get("davetiyeId");

  if (!davetiyeId) {
    return NextResponse.json({ hata: "davetiyeId gerekli." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });

  const davetiye = await prisma.davetiye.findUnique({ where: { id: davetiyeId } });
  if (!davetiye || davetiye.userId !== user.id) {
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
  if (!session?.user?.email) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const { davetiyeId, davetliler } = await req.json();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });

  const davetiye = await prisma.davetiye.findUnique({ where: { id: davetiyeId } });
  if (!davetiye || davetiye.userId !== user.id) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  const yeniDavetliler = await prisma.davetli.createMany({
    data: davetliler.map((d: { ad: string; telefon?: string; email?: string }) => ({
      davetiyeId,
      ad: d.ad,
      telefon: d.telefon || null,
      email: d.email || null,
    })),
  });

  return NextResponse.json({ basarili: true, count: yeniDavetliler.count });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ hata: "id gerekli." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });

  // IDOR önlemi: davetlinin hangi davetiyeye ait olduğunu ve o davetiyenin
  // bu kullanıcıya ait olduğunu doğrula
  const davetli = await prisma.davetli.findUnique({
    where: { id },
    include: { davetiye: { select: { userId: true } } },
  });

  if (!davetli || davetli.davetiye.userId !== user.id) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  await prisma.davetli.delete({ where: { id } });
  return NextResponse.json({ basarili: true });
}