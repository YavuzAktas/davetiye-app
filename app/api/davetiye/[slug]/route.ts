import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
  });

  return NextResponse.json({ davetiye });
}