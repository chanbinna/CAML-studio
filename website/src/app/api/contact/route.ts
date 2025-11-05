import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payloadClient.server";

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const { firstName, lastName, email, phone, message } = await req.json();

    // ✅ 필수 필드 확인
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // ✅ Payload에 저장
    await payload.create({
      collection: "contacts",
      data: { firstName, lastName, email, phone, message },
    });

    // ✅ 사용자 확인 이메일
    await payload.sendEmail({
      to: email,
      subject: "We’ve received your message",
      html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;background:#fafafa;padding:48px;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;overflow:hidden;">
          <div style="padding:48px;">
            <h1 style="margin:0;font-size:20px;font-weight:400;color:#111827;">CRML Studio</h1>
            <p style="margin:6px 0 32px;font-size:13px;color:#6b7280;">Contact Confirmation</p>

            <p style="font-size:14px;color:#374151;">Dear ${firstName},</p>
            <p style="font-size:14px;color:#374151;">
              We’ve successfully received your message and our team will get back to you as soon as possible.
            </p>

            <div style="margin:24px 0;padding:16px;border-top:1px solid #eee;border-bottom:1px solid #eee;">
              <p style="margin:0;font-size:14px;"><strong>Message:</strong></p>
              <p style="margin:4px 0 0;font-size:14px;color:#111827;">${message}</p>
            </div>

            <p style="font-size:13px;color:#6b7280;">You’ll receive a response from our team shortly.</p>
          </div>

          <div style="background:#f5f5f5;padding:16px 24px;text-align:center;font-size:12px;color:#9ca3af;">
            <p style="margin:0;">CRML Studio © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
      `,
    });

    // ✅ 관리자용 이메일
    await payload.sendEmail({
      to: "carmelstudio.official2@gmail.com",
      subject: `New Contact Message – ${firstName} ${lastName}`,
      html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;background:#fafafa;padding:48px;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;overflow:hidden;">
          <div style="padding:40px;">
            <h2 style="margin:0 0 16px;font-size:18px;font-weight:500;color:#111827;">New Contact Submission</h2>
            <p style="font-size:14px;color:#4b5563;">A new contact form was submitted through your website.</p>

            <p style="font-size:14px;margin:16px 0 4px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="font-size:14px;margin:4px 0;"><strong>Email:</strong> ${email}</p>
            ${phone ? `<p style="font-size:14px;margin:4px 0;"><strong>Phone:</strong> ${phone}</p>` : ""}
            <div style="margin:16px 0;padding:12px;border:1px solid #eee;background:#fafafa;">
              <p style="margin:0;font-size:14px;color:#111827;">${message}</p>
            </div>

            <div style="text-align:center;margin-top:20px;">
              <a href="mailto:${email}" 
                style="display:inline-block;padding:10px 24px;border:1px solid #111827;color:#111827;text-decoration:none;font-size:13px;">
                Reply to ${firstName}
              </a>
            </div>
          </div>

          <div style="background:#f5f5f5;padding:16px 24px;text-align:center;font-size:12px;color:#9ca3af;">
            <p style="margin:0;">Automated message from CRML Studio</p>
          </div>
        </div>
      </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Contact submission failed:", err);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}