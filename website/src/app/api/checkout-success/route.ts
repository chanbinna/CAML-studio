import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient();

    const { user } = await payload.auth({ headers: req.headers });
    if (!user) return NextResponse.redirect(new URL("/", req.url));

    const sessionId = new URL(req.url).searchParams.get("session_id");
    if (!sessionId) throw new Error("Missing session ID");

    // ----------------------------
    // 🔥 Stripe에서 결제 세션 + 주소 불러오기
    // ----------------------------
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "customer_details",
        "payment_intent",
        "payment_intent.charges.data.billing_details",
      ],
    });

    const address = session.customer_details?.address ?? null;
    console.log("🟦 Stripe Address:", address);

    // ----------------------------
    // 🛒 장바구니 확인
    // ----------------------------
    const cart = Array.isArray(user.cart) ? user.cart : [];
    if (cart.length === 0)
      return NextResponse.redirect(new URL("/", req.url));

    // 🛒 장바구니 상품 최신 가격 불러오기
    const enrichedItems = await Promise.all(
      cart.map(async (item: any) => {
        try {
          const product = await payload.findByID({
            collection: "shopProducts",
            id: item.productId,
          });
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: Number(product.data?.price ?? 0),
          };
        } catch {
          return { ...item, price: item.price ?? 0 };
        }
      })
    );

    // ----------------------------
    // 💰 총합 계산
    // ----------------------------
    const total = enrichedItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    // ----------------------------
    // 🔥 주소 포함된 주문 객체
    // ----------------------------
    const newOrder = {
      orderId: `ORD-${Date.now()}`,
      items: enrichedItems,
      total,
      purchasedAt: new Date(),
      shippingAddress: {
        line1: address?.line1 || "",
        line2: address?.line2 || "",
        city: address?.city || "",
        state: address?.state || "",
        postal_code: address?.postal_code || "",
        country: address?.country || "",
      },
    };

    // ----------------------------
    // 🔥 login-users 에 저장 (orders + cart 비우기)
    // ----------------------------
    await payload.update({
      collection: "login-users",
      id: user.id,
      data: {
        orders: [...(user.orders || []), newOrder],
        cart: [],
      },
    });

    // ----------------------------
    // 🔥 ShopOrders 컬렉션 저장 (Admin Panel)
    // ----------------------------
    await payload.create({
      collection: "orders",
      data: {
        ...newOrder,
        userId: user.id,
        userEmail: user.email,
        status: "paid",
      },
    });

    // ----------------------------
    // 📦 재고 차감
    // ----------------------------
    for (const item of enrichedItems) {
      // 🔥 ObjectId → slug 둘 다 지원하도록 개선
      let product: any = null;
      try {
        // ① ObjectId 로 찾기
        const result = await payload.findByID({
          collection: "shopProducts",
          id: item.productId,
        });
        product = result.data;
      } catch {
        // ② 못 찾으면 slug 로 찾기
        const res = await payload.find({
          collection: "shopProducts",
          where: { slug: { equals: item.productId } },
        });
        product = res.docs?.[0];
      }

      if (!product) {
        console.warn(`❗ Product not found for stock update: ${item.productId}`);
        continue; // 오류 나도 다른 제품은 계속 진행
      }

      const newStock = Math.max(0, (product.stock || 0) - item.quantity);

      await payload.update({
        collection: "shopProducts",
        id: product.id,
        data: {
          stock: newStock,
          inventory: [
            ...(product.inventory || []),
            {
              quantity: -item.quantity,
              addedAt: new Date(),
              note: `Purchased by ${user.email}`,
            },
          ],
        },
      });
    }

    // ----------------------------
    // 📧 이메일 보내기 (Shipping 포함)
    // ----------------------------
    try {
      await payload.sendEmail({
        to: user.email,
        subject: `Your Order Confirmation – ${newOrder.orderId}`,
        html: `
        <div>
          <h2>Order Confirmation</h2>
          <p>Thank you for your purchase!</p>

          <p><strong>Order ID:</strong> ${newOrder.orderId}</p>
          <p><strong>Total:</strong> $${newOrder.total.toFixed(2)}</p>
          <p><strong>Date:</strong> ${newOrder.purchasedAt.toLocaleString()}</p>

          <h3>Shipping Address</h3>
          <p>
            ${address?.line1 || ""}<br/>
            ${address?.line2 || ""}<br/>
            ${address?.city || ""}, ${address?.state || ""} ${address?.postal_code || ""}<br/>
            ${address?.country || ""}
          </p>
        </div>
        `,
      });
    } catch (e) {
      console.warn("📧 Email failed:", e);
    }

    return NextResponse.redirect(new URL("/order-success", req.url));
  } catch (err) {
    console.error("❌ Cart checkout-success error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}