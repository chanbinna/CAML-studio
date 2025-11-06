import { getPayloadClient } from "@/lib/payloadClient.server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const payload = await getPayloadClient();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.trim() === "") {
    return NextResponse.json({ products: [], workshops: [], categories: [] });
  }

  try {
    const [products, workshops, categories] = await Promise.all([
      // 🛍️ Shop Products — 이름 알파벳순 정렬
      payload.find({
        collection: "shopProducts",
        where: { name: { contains: query } },
        sort: "name", // ✅ 오름차순 (A→Z)
        depth: 1,
        limit: 5,
      }),

      // 🎨 Workshops — 이름 알파벳순 정렬
      payload.find({
        collection: "workshops",
        where: { name: { contains: query } },
        sort: "name", // ✅ 오름차순
        depth: 1,
        limit: 5,
      }),

      // 📂 Categories — 이름 알파벳순 정렬
      payload.find({
        collection: "shopCategories",
        where: { name: { contains: query } },
        sort: "name", // ✅ 오름차순
        limit: 5,
      }),
    ]);

    return NextResponse.json({
      products: products.docs,
      workshops: workshops.docs,
      categories: categories.docs,
    });
  } catch (err) {
    console.error("❌ Search API error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}