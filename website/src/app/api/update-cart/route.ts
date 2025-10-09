import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const { productId, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    // ✅ 로그인된 사용자 인증
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ 기존 cart 가져오기
    const existingCart = Array.isArray(user.cart) ? user.cart : [];

    let updatedCart;

    if (quantity <= 0) {
      // ❌ 수량이 0 이하 → 해당 상품 제거
      updatedCart = existingCart.filter((item: any) => item.productId !== productId);
    } else {
      // ✅ 기존 아이템이 있으면 수정, 없으면 추가
      const found = existingCart.some((item: any) => item.productId === productId);

      updatedCart = found
        ? existingCart.map((item: any) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        : [...existingCart, { productId, quantity }];
    }

    // ✅ DB 업데이트
    await payload.update({
      collection: "login-users",
      id: user.id,
      data: { cart: updatedCart },
    });

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (err) {
    console.error("Update cart error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}