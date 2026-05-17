import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const refKod = typeof body.refKod === "string" ? body.refKod.trim() : "";
  if (!refKod) return NextResponse.json({ ok: false });

  // Kendine referral veremez
  const referrer = await prisma.user.findUnique({
    where: { referralKod: refKod },
    select: { id: true },
  });
  if (!referrer || referrer.id === session.user.id) {
    return NextResponse.json({ ok: false });
  }

  // Zaten bir referral'ı varsa tekrar oluşturma
  const mevcut = await prisma.referral.findUnique({
    where: { referredId: session.user.id },
  });
  if (mevcut) return NextResponse.json({ ok: false });

  await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referredId: session.user.id,
    },
  });

  return NextResponse.json({ ok: true });
}
