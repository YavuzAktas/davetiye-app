import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ipIzinVer, ipAlNextRequest } from "@/lib/rate-limit";

const handler = NextAuth(authOptions);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export { handler as GET };

// 10 giriş denemesi / IP / 15 dakika — sadece credentials callback'e uygulanır
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ nextauth: string[] }> },
) {
  const { nextauth } = await ctx.params;
  const path = (nextauth ?? []).join("/");
  if (path === "callback/credentials") {
    const ip = ipAlNextRequest(req);
    if (!ipIzinVer("giris", ip, 10, 15 * 60_000)) {
      return NextResponse.json(
        { error: "Çok fazla giriş denemesi. Lütfen 15 dakika bekleyin." },
        { status: 429 },
      );
    }
  }
  return (handler as any)(req, ctx);
}