import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const KULLANILABILIR = new Set(["olusturuldu", "gonderildi"]);

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ kod: string }> }
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const { kod } = await params;

  const aktivasyon = await prisma.aktivasyonKodu.findUnique({
    where: { kod },
    select: { id: true, durum: true, musteriUserId: true },
  });

  if (!aktivasyon) {
    return NextResponse.json({ error: "Geçersiz aktivasyon kodu." }, { status: 404 });
  }

  // Zaten bu kullanıcıya bağlı → idempotent, izin ver
  if (aktivasyon.musteriUserId === session.user.id && aktivasyon.durum === "kayit_oldu") {
    return NextResponse.json({ ok: true });
  }

  // Başka birine bağlı
  if (aktivasyon.musteriUserId && aktivasyon.musteriUserId !== session.user.id) {
    return NextResponse.json({ error: "Bu link başka bir kullanıcı tarafından kullanılmış." }, { status: 409 });
  }

  // İptal / zaten davetiye oluşturulmuş
  if (!KULLANILABILIR.has(aktivasyon.durum)) {
    return NextResponse.json({ error: "Bu link artık kullanılamaz." }, { status: 409 });
  }

  await prisma.aktivasyonKodu.update({
    where: { id: aktivasyon.id },
    data: {
      musteriUserId: session.user.id,
      durum: "kayit_oldu",
      kullanilanAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
