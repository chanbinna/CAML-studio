// app/api/shopProducts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Next.js 15 이상에서 params는 Promise
) {
  const { id } = await context.params;

  try {
    const payload = await getPayloadClient();

    // ✅ 상품 데이터 가져오기 (ObjectID → slug 순서로 시도)
    const product = await (async () => {
      try {
        const found = await payload.findByID({
          collection: "shopProducts",
          id,
          depth: 2,
        });
        return found?.data || found;
      } catch {
        const res = await payload.find({
          collection: "shopProducts",
          where: { slug: { equals: id } },
          depth: 2,
        });
        return res.docs?.[0];
      }
    })();

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ doc: product });
  } catch (err) {
    console.error("❌ shopProducts API error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}