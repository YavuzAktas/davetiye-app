import { NextRequest, NextResponse } from "next/server";
import { kodIleTokenAl, spotifyProfil } from "@/lib/spotify";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_URL!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const state = searchParams.get("state"); // user id
  const error = searchParams.get("error");

  if (error || !code || !state) {
    console.error("Spotify callback hata parametresi:", error, "code:", !!code, "state:", !!state);
    return NextResponse.redirect(`${BASE}/dashboard/ayarlar?spotify=hata&neden=${encodeURIComponent(error ?? "eksik_parametre")}`);
  }

  try {
    const tokens  = await kodIleTokenAl(code);
    const profil  = await spotifyProfil(tokens.access_token);

    await prisma.user.update({
      where: { id: state },
      data: {
        spotifyRefreshToken: tokens.refresh_token,
        spotifyId: profil.id,
      },
    });

    return NextResponse.redirect(`${BASE}/dashboard/ayarlar?spotify=baglandi`);
  } catch (err) {
    console.error("Spotify callback exception:", err);
    return NextResponse.redirect(`${BASE}/dashboard/ayarlar?spotify=hata&neden=exception`);
  }
}
