import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const payload = await getPayloadClient();
  const { id } = await context.params; // ✅ await 추가
  const data = await req.json();

  const { user } = await payload.auth({ headers: req.headers });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.id !== id) {
    return NextResponse.json({ error: "You can only update your own profile" }, { status: 403 });
  }

  try {
    const updatedUser = await payload.update({
      collection: "login-users",
      id,
      data,
      overrideAccess: true,
    });
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("❌ Update failed:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}