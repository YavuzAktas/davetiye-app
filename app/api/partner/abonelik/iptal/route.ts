import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    select: { id: true, durum: true },
  });
  if (!partner || partner.durum !== "aktif") {
    return NextResponse.json({ hata: "Aktif partner hesabı gerekli." }, { status: 403 });
  }

  const abonelik = await prisma.partnerAbonelik.findFirst({
    where: { partnerId: partner.id, aktif: true },
    select: {
      id: true,
      iyzicoSubscriptionReferenceCode: true,
      abonelikDurumu: true,
    },
  });

  if (!abonelik) {
    return NextResponse.json({ hata: "Aktif abonelik bulunamadı." }, { status: 404 });
  }

  if (abonelik.abonelikDurumu === "iptal") {
    return NextResponse.json({ hata: "Abonelik zaten iptal edilmiş." }, { status: 409 });
  }

  if (abonelik.iyzicoSubscriptionReferenceCode) {
    const result = await new Promise<any>((resolve, reject) => {
      (iyzipay as any).subscription.cancel(
        { subscriptionReferenceCode: abonelik.iyzicoSubscriptionReferenceCode },
        (err: unknown, res: any) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    }).catch(() => null);

    if (!result || result.status !== "success") {
      return NextResponse.json({ hata: "iyzico abonelik iptali başarısız oldu." }, { status: 500 });
    }
  }

  await prisma.partnerAbonelik.update({
    where: { id: abonelik.id },
    data: {
      otomatikYenileme: false,
      abonelikDurumu: "iptal",
      iptalAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
