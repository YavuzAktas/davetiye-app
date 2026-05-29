import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const davetiyeSayisi = await prisma.davetiye.count({
    where: { odemeDurumu: "odendi" },
  });
  return NextResponse.json({ davetiyeSayisi });
}
