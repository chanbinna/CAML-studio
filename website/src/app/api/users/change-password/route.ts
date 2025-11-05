import { getPayloadClient } from "@/lib/payloadClient.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await getPayloadClient();
  const { currentPassword, newPassword } = await req.json();

  // ✅ 로그인된 유저 확인
  const { user } = await payload.auth({ headers: req.headers });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ 현재 비밀번호 검증: 로그인 시도 방식으로 검증
  try {
    await payload.login({
      collection: "login-users",
      data: { email: user.email!, password: currentPassword },
    });
  } catch {
    return NextResponse.json(
      { error: "Incorrect current password" },
      { status: 400 }
    );
  }

  // ✅ 비밀번호 변경
  await payload.update({
    collection: "login-users",
    id: user.id,
    data: { password: newPassword },
  });

  return NextResponse.json({ success: true });
}