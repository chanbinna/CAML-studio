import { getPayloadClient } from "@/lib/payloadClient.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: req.headers });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user });
}