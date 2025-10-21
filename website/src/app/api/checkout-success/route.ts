import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient();

    // ✅ 로그인된 사용자 확인
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      console.warn("⚠️ Checkout success called without session");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ 장바구니 확인
    const cart = Array.isArray(user.cart) ? user.cart : [];
    if (cart.length === 0) {
      console.warn(`⚠️ ${user.email} tried success route with empty cart`);
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ 장바구니의 최신 상품 정보 (가격 포함)
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

    // ✅ 총합 계산
    const total = enrichedItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    // ✅ 주문 객체 생성
    const newOrder = {
      orderId: `ORD-${Date.now()}`,
      items: enrichedItems,
      total,
      purchasedAt: new Date(),
    };

    // ✅ login-users 컬렉션 업데이트 (기존 orders + cart 초기화)
    await payload.update({
      collection: "login-users",
      id: user.id,
      data: {
        orders: [...(user.orders || []), newOrder],
        cart: [],
      },
    });

    // ✅ ShopOrders 컬렉션에도 주문 저장
    await payload.create({
      collection: "orders", // slug: "orders" from ShopOrders.ts
      data: {
        orderId: newOrder.orderId,
        userId: user.id,
        userEmail: user.email,
        items: enrichedItems,
        total,
        status: "paid",
        purchasedAt: newOrder.purchasedAt,
      },
    });

    console.log(`✅ Order stored for ${user.email}: ${newOrder.orderId}`);

    // ✅ 이메일 알림 (유저 + 관리자)
    try {
      // 사용자 알림
      await payload.sendEmail({
        to: user.email,
        subject: `Your Order Confirmation – ${newOrder.orderId}`,
        html: `
        <div style="font-family:'Helvetica Neue',Inter,Arial,sans-serif; background:#fafafa; padding:48px;">
            <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5; overflow:hidden;">
            <div style="padding:48px 48px 32px;">
                <h1 style="margin:0; font-weight:400; font-size:20px; color:#111827; letter-spacing:0.3px;">CRML Studio</h1>
                <p style="margin:6px 0 32px; font-size:13px; color:#6b7280;">Order Receipt</p>

                <h2 style="margin:0 0 8px; font-weight:500; font-size:18px; color:#111827;">Thank you, ${user.name || "Customer"}</h2>
                <p style="margin:0 0 24px; font-size:14px; color:#4b5563;">Your order has been successfully placed and is now being processed.</p>

                <div style="border-top:1px solid #eee; border-bottom:1px solid #eee; padding:16px 0; margin-bottom:24px;">
                <p style="margin:4px 0; font-size:14px;"><strong>Order ID:</strong> ${newOrder.orderId}</p>
                <p style="margin:4px 0; font-size:14px;"><strong>Total:</strong> $${newOrder.total.toFixed(2)}</p>
                <p style="margin:4px 0; font-size:14px;"><strong>Date:</strong> ${newOrder.purchasedAt.toLocaleString()}</p>
                </div>

                <h3 style="margin:0 0 10px; font-weight:500; font-size:15px; color:#111827;">Order Details</h3>
                <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                    <tr style="background:#f9fafb; text-align:left; color:#6b7280;">
                    <th style="padding:8px;">Product</th>
                    <th style="padding:8px;">Qty</th>
                    <th style="padding:8px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${newOrder.items.map(
                    item => `
                    <tr style="border-bottom:1px solid #f2f2f2;">
                        <td style="padding:8px; color:#111827;">${item.productId}</td>
                        <td style="padding:8px;">${item.quantity}</td>
                        <td style="padding:8px;">$${item.price.toFixed(2)}</td>
                    </tr>`
                    ).join("")}
                </tbody>
                </table>

                <div style="text-align:center; margin-top:36px;">
                <a href="${process.env.NEXT_PUBLIC_API_URL}/orders"
                    style="display:inline-block; padding:10px 24px; border:1px solid #111827; color:#111827; text-decoration:none; font-size:13px; letter-spacing:0.2px;">
                    View My Orders
                </a>
                </div>
            </div>

            <div style="background:#f5f5f5; padding:16px 24px; text-align:center; font-size:12px; color:#9ca3af;">
                <p style="margin:0;">CRML Studio © ${new Date().getFullYear()}</p>
                <p style="margin:4px 0 0;">Need help? <a href="mailto:carmelstudio.official2@gmail.com" style="color:#111827;">Contact Support</a></p>
            </div>
            </div>
        </div>
        `,
        });

      // 관리자 알림
      await payload.sendEmail({
    to: "carmelstudio.official2@gmail.com",
    subject: `New Order – ${newOrder.orderId}`,
    html: `
    <div style="font-family:'Helvetica Neue',Inter,Arial,sans-serif; background:#fafafa; padding:48px;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5;  overflow:hidden;">
        <div style="padding:40px;">
            <h2 style="margin:0 0 8px; font-weight:500; font-size:18px; color:#111827;">New Order Received</h2>
            <p style="margin:0 0 24px; font-size:14px; color:#4b5563;">A new order has been placed on CRML Studio.</p>

            <p style="font-size:14px; margin:0;"><strong>Customer:</strong> ${user.email}</p>
            <p style="font-size:14px; margin:4px 0;"><strong>Order ID:</strong> ${newOrder.orderId}</p>
            <p style="font-size:14px; margin:4px 0;"><strong>Total:</strong> $${newOrder.total.toFixed(2)}</p>
            <p style="font-size:14px; margin:4px 0;"><strong>Status:</strong> Paid</p>

            <h4 style="margin:24px 0 8px; font-weight:500; font-size:14px; color:#111827;">Items</h4>
            <ul style="padding-left:20px; font-size:13px; color:#374151;">
            ${newOrder.items.map(
                item => `<li>${item.productId} — ${item.quantity} × $${item.price.toFixed(2)}</li>`
            ).join("")}
            </ul>

            <div style="text-align:center; margin-top:32px;">
            <a href="${process.env.NEXT_PUBLIC_API_URL}/admin/collections/orders"
                style="display:inline-block; padding:10px 24px; border:1px solid #111827; color:#111827; text-decoration:none; font-size:13px;">
                Open in Admin Panel
            </a>
            </div>
        </div>

        <div style="background:#f5f5f5; padding:16px 24px; text-align:center; font-size:12px; color:#9ca3af;">
            <p style="margin:0;">Automated message from CRML Studio</p>
        </div>
        </div>
    </div>
    `,
    });
    } catch (emailErr) {
      console.warn("⚠️ Email sending failed:", emailErr);
    }

    // ✅ 성공 페이지로 이동
    return NextResponse.redirect(new URL("/order-success", req.url));
  } catch (err) {
    console.error("❌ Checkout success error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}