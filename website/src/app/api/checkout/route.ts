import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayloadClient } from "@/lib/payloadClient.server";  

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CartItem {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: req.headers });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { cancelUrl } = await req.json();

    const existingCart = Array.isArray(user.cart) ? user.cart : [];
    if (existingCart.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const lineItems = await Promise.all(
    existingCart.map(async (item: CartItem) => {
        const product = await (async () => {
            try {
                const result = await payload.findByID({
                collection: "shopProducts",
                id: item.productId,
                });
                return result;
            } catch {
                // ❗ ID로 못 찾으면 slug로 재검색
                const res = await payload.find({
                collection: "shopProducts",
                where: { slug: { equals: item.productId } },
                });
                return res.docs?.[0];
            }
        })();

        const title = product?.name || "Untitled Product";
        const rawPrice = product?.price;
        const price = Number(rawPrice);

        if (!price || isNaN(price)) {
        console.warn(
            `⚠️ Skipping product '${title}' due to invalid price:`,
            rawPrice
        );
        return null;
        }

        const imageUrl = product?.filename
        ? `${baseUrl}/media/products/${product.filename}`
        : undefined;

        return {
        price_data: {
            currency: "usd",
            product_data: {
            name: title,
            description: product?.category?.name || "CRML Studio Product",
            ...(imageUrl ? { images: [imageUrl] } : {}),
            },
            unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
        };
    })
    );

    // ✅ 타입 가드 수정
    const validItems = lineItems.filter(
    (item): item is NonNullable<(typeof lineItems)[number]> => item !== null
    );
    if (validItems.length === 0) {
      return NextResponse.json({ message: "No valid items for checkout" }, { status: 400 });
    }

    const soldOutItems: string[] = [];

    for (const item of existingCart) {
      let product;

      try {
        const result = await payload.findByID({
          collection: "shopProducts",
          id: item.productId,
        });
        product = result.data;
      } catch {
        const res = await payload.find({
          collection: "shopProducts",
          where: { slug: { equals: item.productId } },
        });
        product = res.docs?.[0];
      }

      if (!product) continue;

      const currentStock = Number(product.stock || 0);

      // ❗ 장바구니 수량보다 재고가 부족하면 추가
      if (currentStock < item.quantity) {
        soldOutItems.push(product.name || item.productId);
      }
    }

    // ❗ 만약 하나라도 재고 부족이면 Stripe 세션 생성 중단
    if (soldOutItems.length > 0) {
      return NextResponse.json(
        {
          message: "Some items are sold out",
          soldOut: soldOutItems,
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      // 🔥 추가: 주소 필수 수집
      billing_address_collection: "required",

      // 🔥 추가: 배송 주소 수집
      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      // 🔥 추가: 배송 옵션 (표준 배송)
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Standard Shipping",
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
          },
        },
      ],

      line_items: validItems,

      success_url: `${baseUrl}/api/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/shop`,

      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const error = err as Error;
    console.error("❌ Stripe checkout error:", err);
    return NextResponse.json(
      { message: "Stripe session creation failed", error: error.message },
      { status: 500 }
    );
  }
}