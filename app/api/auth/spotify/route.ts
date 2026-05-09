import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { spotifyAuthUrl } from "@/lib/spotify";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.redirect(new URL("/giris", process.env.NEXT_PUBLIC_URL!));

  // state olarak user id kullanıyoruz — callback'de hangi kullanıcı olduğunu bilmek için
  const url = spotifyAuthUrl(session.user.id);
  return NextResponse.redirect(url);
}
