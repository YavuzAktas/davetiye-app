import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ kredi: 0, referralKod: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralKredi: true, referralKod: true },
  });

  return NextResponse.json({
    kredi: user?.referralKredi ?? 0,
    referralKod: user?.referralKod ?? null,
  });
}
