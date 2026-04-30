import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";

const BASARISIZ = `${process.env.NEXT_PUBLIC_URL}/odeme/basarisiz`;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.formData();
  const token = body.get("token") as string;

  if (!token) {
    return NextResponse.redirect(BASARISIZ);
  }

  const result = await new Promise<any>((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({ token }, (err: unknown, res: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  });

  if (result.status !== "success" || result.paymentStatus !== "SUCCESS") {
    return new NextResponse(null, {
      status: 302,
      headers: { Location: BASARISIZ },
    });
  }

  // Atomik: token kullanılmamışsa işaretle ve planı güncelle.
  // updateMany, "kullanildi:false" koşuluyla atomik çalışır;
  // eşzamanlı iki istek aynı token'ı ikinci kez aktive edemez.
  const odemeToken = await prisma.odemeToken.findUnique({
    where: { token },
    select: { userId: true, planId: true, kullanildi: true, expiresAt: true },
  });

  if (!odemeToken || odemeToken.expiresAt < new Date()) {
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  const guncellendi = await prisma.odemeToken.updateMany({
    where: { token, kullanildi: false },
    data: { kullanildi: true },
  });

  if (guncellendi.count === 0) {
    // Token zaten kullanılmış — race condition veya tekrar istek
    return new NextResponse(null, { status: 302, headers: { Location: BASARISIZ } });
  }

  await prisma.user.update({
    where: { id: odemeToken.userId },
    data: { plan: odemeToken.planId },
  });

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: `${process.env.NEXT_PUBLIC_URL}/odeme/basarili?plan=${odemeToken.planId}`,
    },
  });
}
