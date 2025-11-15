import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayloadClient } from "@/lib/payloadClient.server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface Product {
  id?: string | number;
  name?: string;
  price?: number;
  filename?: string;
  category?: {
    name?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity, returnUrl } = await req.json();
    const payload = await getPayloadClient();

    // ✅ 로그인 확인
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ slug 또는 ObjectId 모두 대응
    let product: Product | null = null;
    try {
      const result = await payload.findByID({
        collection: "shopProducts",
        id: productId,
      });
      product = result.data;
    } catch {
      const res = await payload.find({
        collection: "shopProducts",
        where: { slug: { equals: productId } },
      });
      product = res.docs?.[0];
    }

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const title = product.name || "Untitled Product";
    const rawPrice = Number(product.price);
    if (!rawPrice || isNaN(rawPrice)) {
      return NextResponse.json({ message: "Invalid price" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const imageUrl = product.filename
      ? `${baseUrl}/media/products/${product.filename}`
      : undefined;


    // ✅ Stripe Checkout 세션 생성
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      billing_address_collection: "required", 
      
      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Standard Shipping",
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,   // 무료배송이면 0
              currency: "usd",
            },
          },
        },
      ],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: product.category?.name || "CRML Studio Product",
              ...(imageUrl ? { images: [imageUrl] } : {}),
            },
            unit_amount: Math.round(rawPrice * 100),
          },
          quantity: quantity || 1,
        },
      ],
      

      success_url: `${baseUrl}/api/checkout-success-single?session_id={CHECKOUT_SESSION_ID}&productId=${productId}&quantity=${quantity}`,
      cancel_url: returnUrl || `${baseUrl}/shop`,
      metadata: {
        userId: user.id,
        productId,
      },
    });

    return NextResponse.json({ url: session.url }); // ✅ 이제 프론트에서 data.url 로 접근 가능
  } catch (err) {
    const error = err as Error;
    console.error("❌ Stripe checkout error:", error);
    return NextResponse.json(
      { message: "Stripe Checkout session failed", error: error.message },
      { status: 500 }
    );
  }
}