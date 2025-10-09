// app/api/add-to-cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const { productId, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 400 }
      );
    }

    // ✅ 쿠키 기반 인증 (Authorization 헤더 X)
    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ 기존 장바구니 불러오기 및 업데이트
    const existingCart = Array.isArray(user.cart) ? user.cart : [];
    const existingItem = existingCart.find(
      (item: any) => item.productId === productId
    );

    const newCart = existingItem
      ? existingCart.map((item: any) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...existingCart, { productId, quantity }];

    // ✅ DB 업데이트
    await payload.update({
      collection: "login-users",
      id: user.id,
      data: { cart: newCart },
    });

    return NextResponse.json({ success: true, cart: newCart });
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}