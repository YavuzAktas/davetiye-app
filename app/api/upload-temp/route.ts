import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json({ hata: "Depolama yapılandırılmamış." }, { status: 503 });

  const form = await req.formData();
  const dosya = form.get("dosya") as File | null;

  if (!dosya) return NextResponse.json({ hata: "Dosya gerekli." }, { status: 400 });
  if (dosya.size > 6_000_000) return NextResponse.json({ hata: "Dosya max 6 MB." }, { status: 400 });
  if (!dosya.type.startsWith("image/")) return NextResponse.json({ hata: "Sadece resim." }, { status: 400 });

  const blob = await put(
    `polaroid/${session.user.id}/${Date.now()}-${dosya.name.replace(/[^a-z0-9.]/gi, "_")}`,
    dosya,
    { access: "public" }
  );

  return NextResponse.json({ url: blob.url });
}
