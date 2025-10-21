// app/api/add-to-cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

interface CartItem {
  productId: string;
  quantity: number;
  price?: number;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const { productId, quantity } = (await req.json()) as CartItem;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 400 }
      );
    }

    // ✅ 인증 (로그인된 유저만 가능)
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ 상품 가격 가져오기
    const product = await (async () => {
      try {
        // ObjectId로 시도
        const found = await payload.findByID({
          collection: "shopProducts",
          id: productId,
        });
        return found?.data;
      } catch {
        // 실패 시 slug로 시도
        const res = await payload.find({
          collection: "shopProducts",
          where: { slug: { equals: productId } },
        });
        return res.docs?.[0];
      }
    })();

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const price = Number(product.price ?? 0);
    if (!price || isNaN(price)) {
      return NextResponse.json(
        { message: "Invalid product price" },
        { status: 400 }
      );
    }

    // ✅ 기존 장바구니 가져오기
    const existingCart = Array.isArray(user.cart)
      ? (user.cart as CartItem[])
      : [];

    const existingItem = existingCart.find(
      (item) => item.productId === productId
    );

    // ✅ 수량 업데이트 또는 새 항목 추가
    const newCart = existingItem
      ? existingCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity, price }
            : item
        )
      : [...existingCart, { productId, quantity, price }];

    // ✅ DB 업데이트
    await payload.update({
      collection: "login-users",
      id: user.id,
      data: { cart: newCart },
    });

    return NextResponse.json({ success: true, cart: newCart });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}