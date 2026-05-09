import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tokenYenile, playlistOlustur } from "@/lib/spotify";

type Params = { params: Promise<{ slug: string }> };

/* POST — Spotify playlist oluştur + davetiyeye bağla */
export async function POST(_req: Request, { params }: Params) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { spotifyRefreshToken: true, spotifyId: true },
  });

  if (!user?.spotifyRefreshToken || !user.spotifyId) {
    return NextResponse.json({ hata: "Spotify hesabı bağlı değil." }, { status: 400 });
  }

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: { id: true, baslik: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  try {
    const accessToken = await tokenYenile(user.spotifyRefreshToken);
    console.log("Spotify spotifyId:", user.spotifyId);
    // /me endpoint ile gerçek profili doğrula
    const meRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const me = await meRes.json();
    console.log("Spotify /me id:", me.id, "stored id:", user.spotifyId);
    const gerçekId = me.id ?? user.spotifyId;
    if (me.id && me.id !== user.spotifyId) {
      await prisma.user.update({ where: { id: session.user.id }, data: { spotifyId: me.id } });
    }
    const playlist = await playlistOlustur(gerçekId, `🎵 ${davetiye.baslik}`, accessToken);

    await prisma.davetiye.update({
      where: { id: davetiye.id },
      data: { spotifyPlaylistId: playlist.id, spotifyAktif: true },
    });

    return NextResponse.json({ playlistUrl: playlist.url });
  } catch (err) {
    console.error("Playlist oluşturma hatası:", err);
    return NextResponse.json({ hata: "Playlist oluşturulamadı." }, { status: 500 });
  }
}

/* DELETE — Spotify entegrasyonunu devre dışı bırak */
export async function DELETE(_req: Request, { params }: Params) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: { id: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  await prisma.davetiye.update({
    where: { id: davetiye.id },
    data: { spotifyAktif: false, spotifyPlaylistId: null },
  });

  return NextResponse.json({ tamam: true });
}
