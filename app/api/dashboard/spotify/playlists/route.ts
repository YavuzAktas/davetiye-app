import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tokenYenile } from "@/lib/spotify";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { spotifyRefreshToken: true },
  });

  if (!user?.spotifyRefreshToken) {
    return NextResponse.json({ bagli: false, playlists: [] });
  }

  try {
    const accessToken = await tokenYenile(user.spotifyRefreshToken);
    const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return NextResponse.json({ bagli: true, playlists: [] });

    const data = await res.json();
    const playlists = (data.items ?? []).map((p: any) => ({
      id:    p.id,
      isim:  p.name,
      kapak: p.images?.[0]?.url ?? null,
      sarki: p.tracks?.total ?? 0,
    }));

    return NextResponse.json({ bagli: true, playlists });
  } catch {
    return NextResponse.json({ bagli: true, playlists: [] });
  }
}
