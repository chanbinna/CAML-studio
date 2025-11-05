import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";
import { stringify } from "csv-stringify/sync";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reservationId = searchParams.get("reservationId");
  const payload = await getPayloadClient();

  // ✅ 단일 워크샵 export
  if (reservationId) {
    const doc = await payload.findByID({
      collection: "workshop-reservations",
      id: reservationId,
      depth: 2,
    });

    if (!doc || !doc.attendees?.length) {
      return new NextResponse("No attendees found.", { status: 404 });
    }

    // ✅ workshop 이름 처리 (text or relationship 둘 다 대응)
    const workshopName =
      typeof doc.workshop === "string"
        ? doc.workshop
        : (doc.workshop as any)?.name || "unknown";

    const dateLabel = doc.schedule || "no-date";

    // ✅ 파일명 slugify
    const safe = (str: string) =>
      str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const fileName = `workshop-${safe(workshopName)}-${safe(dateLabel)}.csv`;

    const records = doc.attendees.map((a: any) => ({
      Workshop: workshopName,
      Schedule: dateLabel,
      FirstName: a.firstName || "",
      LastName: a.lastName || "",
      Email: a.userEmail || "",
      Fee: a.fee || 0,
      ReservedAt: a.reservedAt
        ? new Date(a.reservedAt).toLocaleString()
        : "N/A",
    }));

    const csv = stringify(records, { header: true });
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  }

  // ✅ 전체 워크샵 export
  const res = await payload.find({
    collection: "workshop-reservations",
    depth: 2,
    limit: 1000,
  });

  const records = res.docs.flatMap((doc: any) => {
    const workshopName =
      typeof doc.workshop === "string"
        ? doc.workshop
        : (doc.workshop as any)?.name || "unknown";

    return (doc.attendees || []).map((a: any) => ({
      Workshop: workshopName,
      Schedule: doc.schedule || "",
      FirstName: a.firstName || "",
      LastName: a.lastName || "",
      Email: a.userEmail || "",
      Fee: a.fee || 0,
      ReservedAt: a.reservedAt
        ? new Date(a.reservedAt).toLocaleString()
        : "N/A",
    }));
  });

  const csv = stringify(records, { header: true });
  const today = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="all-workshops-${today}.csv"`,
    },
  });
}