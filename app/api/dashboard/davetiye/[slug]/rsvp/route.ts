import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props { params: Promise<{ slug: string }> }

export async function GET(req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: { id: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  const rsvplar = await prisma.rSVP.findMany({
    where: { davetiyeId: davetiye.id },
    select: { id: true, ad: true, telefon: true, katilim: true, kisiSayisi: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ rsvplar });
}
