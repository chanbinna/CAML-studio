import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient();

    // ✅ req.headers를 그대로 전달해야 함 (Object.fromEntries ❌)
    const { user } = await payload.auth({ headers: req.headers });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = Array.isArray(user.cart) ? user.cart : [];

    // ✅ 제품 상세 데이터 병합
    const detailedCart = await Promise.all(
      cart.map(async (item: any) => {
        try {
          const product = await payload.findByID({
            collection: "shopProducts",
            id: item.productId,
          });

          return {
            productId: item.productId,
            quantity: item.quantity,
            name: product?.name || "Unknown Product",
            category:
              typeof product?.category === "object"
                ? product.category?.name
                : product?.category || "Uncategorized",
            price: product?.price || 0,
            thumbnail: product?.filename
            ? `/media/products/${product.filename}`
            : "/placeholder.png",
          };
        } catch {
          return {
            productId: item.productId,
            quantity: item.quantity,
            name: "Unknown Product",
            category: "Uncategorized",
            price: 0,
            thumbnail: "/placeholder.png",
          };
        }
      })
    );

    return NextResponse.json({ cart: detailedCart });
  } catch (err) {
    console.error("Get cart error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}