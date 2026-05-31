import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { slug, id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const guncelle = await prisma.davetiyePersonelErisim.updateMany({
    where: {
      id,
      davetiye: { slug, userId: session.user.id },
      aktif: true,
    },
    data: {
      aktif: false,
      revokedAt: new Date(),
    },
  });

  if (guncelle.count === 0) {
    return NextResponse.json({ hata: "Personel erişimi bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
