import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

export async function GET(req: NextRequest) {
  const payload = await getPayloadClient();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const quantity = Number(searchParams.get("quantity") || 1);

  const { user } = await payload.auth({ headers: req.headers });
  if (!user) return NextResponse.redirect(new URL("/", req.url));

  try {
    // ✅ slug / id 둘 다 지원
    let product: any = null;
    try {
      const result = await payload.findByID({
        collection: "shopProducts",
        id: productId!,
      });
      product = result.data;
    } catch {
      const res = await payload.find({
        collection: "shopProducts",
        where: { slug: { equals: productId } },
      });
      product = res.docs?.[0];
    }

    if (!product) throw new Error("Product not found");

    const price = Number(product.price ?? 0);
    if (!price) throw new Error("Invalid product price");

    const order = {
      orderId: `ORD-${Date.now()}`,
      items: [{ productId, quantity, price }],
      total: price * quantity,
      purchasedAt: new Date(),
    };

    // ✅ login-users 컬렉션에 저장
    await payload.update({
      collection: "login-users",
      id: user.id,
      data: {
        orders: [...(user.orders || []), order],
      },
    });

    // ✅ ShopOrders 컬렉션에도 저장
    await payload.create({
      collection: "orders",
      data: {
        orderId: order.orderId,
        userId: user.id,
        userEmail: user.email,
        items: order.items,
        total: order.total,
        status: "paid",
        purchasedAt: order.purchasedAt,
      },
    });

    console.log(`✅ Single checkout order stored: ${order.orderId}`);

    // ✅ 이메일 알림 (유저 + 관리자)
    try {
      // 사용자 알림
      await payload.sendEmail({
        to: user.email,
        subject: `Your Order Confirmation – ${order.orderId}`,
        html: `
        <div style="font-family:'Helvetica Neue',Inter,Arial,sans-serif; background:#fafafa; padding:48px;">
          <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5;">
            <div style="padding:48px;">
              <h1 style="margin:0; font-weight:400; font-size:20px;">CRML Studio</h1>
              <p style="margin:6px 0 32px; font-size:13px; color:#6b7280;">Order Receipt</p>

              <h2 style="margin:0 0 8px; font-weight:500; font-size:18px;">Thank you, ${user.name || "Customer"}</h2>
              <p style="margin:0 0 24px; font-size:14px;">Your order has been successfully placed.</p>

              <div style="border-top:1px solid #eee; border-bottom:1px solid #eee; padding:16px 0; margin-bottom:24px;">
                <p style="margin:4px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
                <p style="margin:4px 0;"><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                <p style="margin:4px 0;"><strong>Date:</strong> ${order.purchasedAt.toLocaleString()}</p>
              </div>

              <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                  <tr style="background:#f9fafb; text-align:left; color:#6b7280;">
                    <th style="padding:8px;">Product</th>
                    <th style="padding:8px;">Qty</th>
                    <th style="padding:8px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid #f2f2f2;">
                    <td style="padding:8px; color:#111827;">${product.name}</td>
                    <td style="padding:8px;">${quantity}</td>
                    <td style="padding:8px;">$${price.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div style="text-align:center; margin-top:36px;">
                <a href="${process.env.NEXT_PUBLIC_API_URL}/orders"
                  style="display:inline-block; padding:10px 24px; border:1px solid #111827; color:#111827; text-decoration:none;">
                  View My Orders
                </a>
              </div>
            </div>
          </div>
        </div>
        `,
      });

      // 관리자 알림
      await payload.sendEmail({
        to: "carmelstudio.official2@gmail.com",
        subject: `New Order – ${order.orderId}`,
        html: `
        <div style="font-family:'Helvetica Neue',Inter,Arial,sans-serif; background:#fafafa; padding:48px;">
          <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5; padding:40px;">
            <h2 style="margin:0 0 8px; font-weight:500;">New Order Received</h2>
            <p>A new order has been placed on CRML Studio.</p>
            <p><strong>Customer:</strong> ${user.email}</p>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>

            <h4 style="margin-top:24px;">Items</h4>
            <ul style="padding-left:20px; font-size:13px;">
              <li>${product.name} — ${quantity} × $${price.toFixed(2)}</li>
            </ul>

            <div style="text-align:center; margin-top:32px;">
              <a href="${process.env.NEXT_PUBLIC_API_URL}/admin/collections/orders"
                style="display:inline-block; padding:10px 24px; border:1px solid #111827; color:#111827; text-decoration:none;">
                Open in Admin Panel
              </a>
            </div>
          </div>
        </div>
        `,
      });
    } catch (emailErr) {
      console.warn("⚠️ Email sending failed:", emailErr);
    }

    return NextResponse.redirect(new URL("/order-success", req.url));
  } catch (err) {
    console.error("❌ checkout-success-single error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}