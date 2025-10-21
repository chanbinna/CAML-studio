import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

interface CartItem {
  productId: string;
  quantity: number;
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: req.headers });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart: CartItem[] = Array.isArray(user.cart)
      ? (user.cart as CartItem[])
      : [];

    const detailedCart = await Promise.all(
      cart.map(async (item: CartItem) => {
        try {
          // ✅ 1️⃣ ID로 조회 시도
          let product;
          try {
            product = await payload.findByID({
              collection: "shopProducts",
              id: item.productId,
            });
          } catch {
            // ✅ 2️⃣ slug로 재시도
            const result = await payload.find({
              collection: "shopProducts",
              where: { slug: { equals: item.productId } },
            });
            product = result?.docs?.[0];
          }

          if (!product) {
            throw new Error("Product not found");
          }

          return {
            productId: item.productId,
            quantity: item.quantity,
            name: product.name || "Unknown Product",
            category:
              typeof product.category === "object"
                ? product.category?.name
                : product.category || "Uncategorized",
            price: product.price || 0,
            thumbnail: product.filename
              ? `/media/products/${product.filename}`
              : "/placeholder.png",
          };
        } catch (err) {
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