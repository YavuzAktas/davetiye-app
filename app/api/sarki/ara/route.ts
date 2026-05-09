import { NextRequest, NextResponse } from "next/server";
import { clientToken, sarkilaraAra } from "@/lib/spotify";

/* Misafir tarafı arama proxy — auth gerektirmez */
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    const token   = await clientToken();
    const sonuclar = await sarkilaraAra(q, token);
    return NextResponse.json(sonuclar);
  } catch {
    return NextResponse.json([]);
  }
}
