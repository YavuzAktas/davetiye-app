import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { yasalOnayKaydiOlustur } from "@/lib/yasal-onay-kaydi";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { kvkkOnay: true, kvkkOnayTarih: new Date() },
    select: { id: true, email: true },
  });

  await yasalOnayKaydiOlustur({
    userId: user.id,
    email: user.email,
    onayTipi: "dashboard-kvkk-aydinlatma-ve-kullanim-sartlari",
    kaynak: "kvkk-onay-sayfasi",
  });

  return NextResponse.json({ ok: true });
}
