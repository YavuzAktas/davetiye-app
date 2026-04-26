import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.formData();
  const token = body.get("token") as string;

  if (!token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/odeme/basarisiz`
    );
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
      headers: { Location: `${process.env.NEXT_PUBLIC_URL}/odeme/basarisiz` },
    });
  }

  const odemeToken = await prisma.odemeToken.findUnique({
    where: { token },
  });

  if (!odemeToken) {
    return new NextResponse(null, {
      status: 302,
      headers: { Location: `${process.env.NEXT_PUBLIC_URL}/odeme/basarisiz` },
    });
  }

  await prisma.user.update({
    where: { id: odemeToken.userId },
    data: { plan: odemeToken.planId },
  });

  await prisma.odemeToken.delete({ where: { token } });

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: `${process.env.NEXT_PUBLIC_URL}/odeme/basarili?plan=${odemeToken.planId}`,
    },
  });
}