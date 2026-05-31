import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";
import { getSiteUrl } from "@/lib/site-url";

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
    select: { id: true, iyzicoSubscriptionReferenceCode: true, abonelikDurumu: true },
  });

  if (!abonelik?.iyzicoSubscriptionReferenceCode) {
    return NextResponse.json({ hata: "Otomatik yenileme aktif abonelik bulunamadı." }, { status: 404 });
  }

  if (abonelik.abonelikDurumu === "iptal") {
    return NextResponse.json({ hata: "İptal edilmiş abonelikte kart güncellenemiyor." }, { status: 409 });
  }

  const conversationId = `kart-${partner.id}-${Date.now()}`;
  const callbackUrl = `${getSiteUrl()}/partner/panel?kart=guncellendi`;

  const result = await new Promise<any>((resolve, reject) => {
    (iyzipay as any).subscriptionCard.updateWithSubscriptionReferenceCode(
      {
        locale: "tr",
        conversationId,
        subscriptionReferenceCode: abonelik.iyzicoSubscriptionReferenceCode,
        callbackUrl,
      },
      (err: unknown, res: any) => {
        if (err) reject(err);
        else resolve(res);
      }
    );
  }).catch(() => null);

  if (!result || result.status !== "success") {
    return NextResponse.json({ hata: "Kart güncelleme formu başlatılamadı." }, { status: 500 });
  }

  return NextResponse.json({ checkoutFormContent: result.checkoutFormContent });
}
