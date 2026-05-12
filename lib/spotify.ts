const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const BASE_URL      = process.env.NEXT_PUBLIC_URL!;

export const REDIRECT_URI = `${BASE_URL}/api/auth/spotify/callback`;

/* ── OAuth URL ─────────────────────────────────────── */
export function spotifyAuthUrl(state: string) {
  const scopes = [
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: scopes,
    redirect_uri: REDIRECT_URI,
    state,
    show_dialog: "true",
  });

  return `https://accounts.spotify.com/authorize?${params}`;
}

/* ── Code → Tokens ─────────────────────────────────── */
export async function kodIleTokenAl(code: string) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  if (!res.ok) throw new Error("Spotify token alınamadı");
  return res.json() as Promise<{ access_token: string; refresh_token: string; expires_in: number }>;
}

/* ── Refresh token → yeni access token ─────────────── */
export async function tokenYenile(refreshToken: string) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Token yenilenemedi — HTTP ${res.status}: ${errBody}`);
  }
  const json = await res.json();
  return json.access_token as string;
}

/* ── Client credentials (arama için, kullanıcı girişi gerekmez) ── */
export async function clientToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  if (!res.ok) throw new Error("Client token alınamadı");
  const json = await res.json();
  return json.access_token as string;
}

/* ── Spotify kullanıcı profili ─────────────────────── */
export async function spotifyProfil(accessToken: string) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Profil alınamadı");
  return res.json() as Promise<{ id: string; display_name: string }>;
}

/* ── Şarkı ara ─────────────────────────────────────── */
export async function sarkilaraAra(q: string, token: string) {
  const params = new URLSearchParams({ q, type: "track", limit: "5", market: "TR" });
  const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.tracks?.items ?? []).map((t: any) => ({
    id:       t.id,
    uri:      t.uri,
    isim:     t.name,
    sanatci:  t.artists.map((a: any) => a.name).join(", "),
    album:    t.album.name,
    kapak:    t.album.images?.[2]?.url ?? t.album.images?.[0]?.url ?? null,
  }));
}

/* ── Playlist oluştur ──────────────────────────────── */
export async function playlistOlustur(
  spotifyUserId: string,
  isim: string,
  accessToken: string
) {
  const safeIsim = isim.replace(/[^\x20-\x7EÀ-ɏЀ-ӿ]/g, "").trim() || "Etkinlik Listesi";
  const url = `https://api.spotify.com/v1/me/playlists`;
  const body = JSON.stringify({ name: safeIsim, description: "Bekleriz tarafindan olusturuldu", public: false });
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "(body okunamadı)");
    throw new Error(`Playlist oluşturulamadı — HTTP ${res.status}: ${errBody}`);
  }
  const json = await res.json();
  return { id: json.id as string, url: json.external_urls?.spotify as string };
}

/* ── Playlist'e şarkı ekle ─────────────────────────── */
export async function playlistEEkle(
  playlistId: string,
  trackUri: string,
  accessToken: string
) {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ uris: [trackUri] }),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    console.error(`playlistEEkle HTTP ${res.status}: ${errBody} | playlistId: ${playlistId}`);
  }
  return res.ok;
}

/* Spotify max 100 URI/istek — büyük listeleri parçala */
export async function playlistCokluEkle(
  playlistId: string,
  trackUris: string[],
  accessToken: string
) {
  const unique = [...new Set(trackUris)];
  for (let i = 0; i < unique.length; i += 100) {
    const batch = unique.slice(i, i + 100);
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ uris: batch }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error(`playlistCokluEkle HTTP ${res.status}: ${errBody}`);
    }
  }
}
