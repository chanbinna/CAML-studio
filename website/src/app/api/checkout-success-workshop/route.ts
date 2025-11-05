import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

export async function GET(req: NextRequest) {
  // ✅ 인증용 payload
  const payload = await getPayloadClient();
  const { searchParams } = new URL(req.url);
  const workshopId = searchParams.get("workshopId");
  const scheduleLabel = searchParams.get("scheduleLabel");

  const { user } = await payload.auth({ headers: req.headers });
  if (!user) return NextResponse.redirect(new URL("/", req.url));

  // ✅ 순수 업데이트용 payload
  const purePayload = await getPayloadClient();

  try {
    // ✅ 워크샵 정보
    const res = await purePayload.find({
      collection: "workshops",
      where: { id: { equals: workshopId } },
    });
    const workshop = res.docs?.[0];
    if (!workshop) throw new Error("Workshop not found");

    const fee = Number(workshop.fee ?? 0);
    if (!fee) throw new Error("Invalid workshop fee");

    // ✅ 워크샵 예약 조회
    const existing = await purePayload.find({
      collection: "workshop-reservations",
      where: {
        and: [
          { workshop: { equals: workshop.name } }, // ✅ 이름 기준으로 찾기
          { schedule: { equals: scheduleLabel } },
        ],
      },
      depth: 0,
    });

    const attendeeData = {
      user: String(user.id),
      firstName: (user as any).name,
      lastName: (user as any).lastName,
      userEmail: user.email,
      fee,
      reservedAt: new Date(),
    };

    if (existing.docs.length > 0) {
      const doc = existing.docs[0];
      await purePayload.update({
        collection: "workshop-reservations",
        id: doc.id,
        data: {
          workshop: workshop.name,
          attendees: [...(doc.attendees || []), attendeeData],
        },
        overrideAccess: true,
        depth: 0,
      });
    } else {
      await purePayload.create({
        collection: "workshop-reservations",
        data: {
          workshop: workshop.name,
          schedule: scheduleLabel,
          attendees: [attendeeData],
          totalAttendees: 1,
        },
        overrideAccess: true,
        depth: 0,
      });
    }

    // ✅ 유저 워크샵 업데이트
    const userDoc = await purePayload.findByID({
      collection: "login-users",
      id: user.id,
      depth: 0,
    });

    const cleanWorkshops = JSON.parse(JSON.stringify(userDoc.workshops || []));
    const reservation = {
      workshopId,
      workshopName: workshop.name,
      schedule: scheduleLabel,
      fee,
      reservedAt: new Date(),
    };

    await purePayload.update({
      collection: "login-users",
      id: user.id,
      data: {
        workshops: [...cleanWorkshops, reservation],
      },
      overrideAccess: true,
      depth: 0,
    });

    console.log("✅ User workshops updated safely");

    // ✅ 이메일 (purePayload로 발송)
    try {
      await purePayload.sendEmail({
        to: user.email,
        subject: `Workshop Reservation Confirmed – ${workshop.name}`,
        html: `
          <div style="font-family:'Helvetica Neue',Inter,Arial,sans-serif; background:#fafafa; padding:48px;">
            <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5;">
              <div style="padding:48px;">
                <h1 style="margin:0; font-weight:400; font-size:20px;">CRML Studio</h1>
                <p style="margin:6px 0 32px; font-size:13px; color:#6b7280;">Workshop Confirmation</p>
                <h2 style="margin:0 0 8px; font-weight:500; font-size:18px;">Thank you, ${user.name || "Guest"}</h2>
                <p>Your workshop reservation has been confirmed.</p>
              </div>
            </div>
          </div>
        `,
      });

      await purePayload.sendEmail({
        to: "carmelstudio.official2@gmail.com",
        subject: `New Workshop Reservation – ${workshop.name}`,
        html: `
          <div style="font-family:'Helvetica Neue',Inter,Arial,sans-serif; background:#fafafa; padding:48px;">
            <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5; padding:40px;">
              <h2 style="margin:0 0 8px; font-weight:500;">New Workshop Reservation</h2>
              <p><strong>Customer:</strong> ${user.name || ""} ${user.lastName || ""} (${user.email})</p>
              <p><strong>Workshop:</strong> ${workshop.name}</p>
              <p><strong>Schedule:</strong> ${scheduleLabel}</p>
              <p><strong>Fee:</strong> $${fee.toFixed(2)}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
      });
      console.log("✅ Emails sent successfully");
    } catch (emailErr) {
      console.warn("⚠️ Email sending failed:", emailErr);
    }

    return NextResponse.redirect(new URL("/workshop-success", req.url));
  } catch (err) {
    console.error("❌ checkout-success-workshop error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}