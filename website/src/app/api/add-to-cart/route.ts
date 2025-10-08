// app/api/add-to-cart/route.ts
import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server"; // ✅ 방금 만든 helper import

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    const payload = await getPayloadClient(); // ✅ Payload 인스턴스 초기화

    const verified = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`,
      }),
    });

    const user = (verified as any)?.user;
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

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

    await payload.update({
      collection: "login-users",
      id: user.id,
      data: { cart: newCart },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}