import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayloadClient } from "@/lib/payloadClient.server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { workshopId, scheduleLabel } = await req.json();
    const payload = await getPayloadClient();

    // ✅ 로그인 확인
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ 워크샵 데이터 조회
    const res = await payload.find({
      collection: "workshops",
      where: { id: { equals: workshopId } },
    });
    const workshop = res.docs?.[0];
    if (!workshop) {
      return NextResponse.json({ message: "Workshop not found" }, { status: 404 });
    }

    const title = workshop.name || "Workshop";
    const fee = Number(workshop.fee);
    if (!fee || isNaN(fee)) {
      return NextResponse.json({ message: "Invalid workshop fee" }, { status: 400 });
    }

    // ✅ 중복 예약 방지 로직 (결제 시작 전)
    // ✅ 중복 예약 방지 로직 (결제 시작 전)
const existing = await payload.find({
  collection: "workshop-reservations",
  where: {
    and: [
      { workshop: { equals: workshopId } },
      { schedule: { equals: scheduleLabel } },
      { "attendees.userEmail": { equals: user.email } },
    ],
  },
});

if (existing.docs.length > 0) {
  return NextResponse.json(
    {
      message:
        "You’ve already reserved this workshop schedule. Please check your reservations.",
    },
    { status: 400 }
  );
}



    // ✅ 이미지 URL 처리 (Stripe 안전 URL)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const rawUrl = workshop.image?.url;
    let imageUrl: string | undefined;

    if (rawUrl) {
      if (rawUrl.startsWith("http")) {
        imageUrl = rawUrl;
      } else {
        imageUrl = `${baseUrl}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
      }
    }

    // ✅ Stripe Checkout 세션 생성
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: `Schedule: ${scheduleLabel}`,
              ...(imageUrl ? { images: [imageUrl] } : {}),
            },
            unit_amount: Math.round(fee * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/api/checkout-success-workshop?workshopId=${workshopId}&scheduleLabel=${encodeURIComponent(scheduleLabel)}`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        userId: user.id,
        workshopId,
        scheduleLabel,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const error = err as Error;
    console.error("❌ Stripe Workshop Checkout Error:", error);
    return NextResponse.json(
      { message: "Stripe checkout failed", error: error.message },
      { status: 500 }
    );
  }
}