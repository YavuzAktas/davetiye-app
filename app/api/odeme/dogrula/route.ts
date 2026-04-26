import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const token = body.get("token") as string;

  if (!token) {
    return new NextResponse(null, {
      status: 302,
      headers: { Location: `${process.env.NEXT_PUBLIC_URL}/odeme/basarisiz` },
    });
  }

  return new Promise((resolve) => {
    iyzipay.checkoutForm.retrieve({ token }, async (err: unknown, result: any) => {
      if (err || result.status !== "success" || result.paymentStatus !== "SUCCESS") {
        resolve(
          new NextResponse(null, {
            status: 302,
            headers: { Location: `${process.env.NEXT_PUBLIC_URL}/odeme/basarisiz` },
          })
        );
        return;
      }

      const odemeToken = await prisma.odemeToken.findUnique({
        where: { token },
      });

      if (!odemeToken) {
        resolve(
          new NextResponse(null, {
            status: 302,
            headers: { Location: `${process.env.NEXT_PUBLIC_URL}/odeme/basarisiz` },
          })
        );
        return;
      }

      await prisma.user.update({
        where: { id: odemeToken.userId },
        data: { plan: odemeToken.planId },
      });

      await prisma.odemeToken.delete({ where: { token } });

      resolve(
        new NextResponse(null, {
          status: 302,
          headers: {
            Location: `${process.env.NEXT_PUBLIC_URL}/odeme/basarili?plan=${odemeToken.planId}`,
          },
        })
      );
    });
  });
}