import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ipIzinVer } from "@/lib/rate-limit";

interface Props {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  if (!(await ipIzinVer("partner-ekip-iptal", session.user.id, 30, 60 * 60_000))) {
    return NextResponse.json({ hata: "Saatlik ekip erişimi işlem limitine ulaştınız." }, { status: 429 });
  }

  const guncelle = await prisma.partnerEkipErisim.updateMany({
    where: {
      id,
      partner: { userId: session.user.id },
      aktif: true,
    },
    data: {
      aktif: false,
      revokedAt: new Date(),
    },
  });

  if (guncelle.count === 0) {
    return NextResponse.json({ hata: "Ekip erişimi bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
