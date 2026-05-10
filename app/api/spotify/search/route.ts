import { NextRequest, NextResponse } from "next/server";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token;

  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Spotify token alınamadı");
  const data = await res.json();

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ tracks: [] });

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json({ tracks: [], hata: "Spotify yapılandırılmamış" }, { status: 503 });
  }

  try {
    const token = await getToken();
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=6&market=TR`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();

    const tracks = (data.tracks?.items ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
      artist: t.artists[0]?.name ?? "Bilinmiyor",
      image: t.album?.images?.[2]?.url ?? t.album?.images?.[0]?.url ?? null,
      duration_ms: t.duration_ms,
    }));

    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ tracks: [], hata: "Arama başarısız" }, { status: 500 });
  }
}
