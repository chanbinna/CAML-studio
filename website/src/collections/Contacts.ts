import { CollectionConfig } from "payload";

export const Contacts: CollectionConfig = {
  slug: "contacts",
  labels: {
    singular: "Contact Message",
    plural: "Contact Messages",
  },
  admin: {
    useAsTitle: "email",
    group: "Site Contents",
    defaultColumns: [
      "firstName",
      "lastName",
      "email",
      "message",
      "reply",
      "repliedAt",
    ],
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: "firstName", type: "text", required: true },
    { name: "lastName", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
    { name: "message", type: "textarea", required: true },

    // ✅ 관리자 답장 추가
    {
      name: "reply",
      type: "textarea",
      label: "Admin Reply",
      admin: {
        description: "Write a reply message here and save to send an email.",
      },
    },
    {
      name: "repliedAt",
      type: "date",
      label: "Replied At",
    },
  ],

  // ✅ 자동 이메일 Hook
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // reply가 새로 작성되었을 때만 발송
        if (
          operation === "update" &&
          doc.reply &&
          doc.reply !== previousDoc?.reply
        ) {
          try {
            await req.payload.sendEmail({
              to: doc.email,
              subject: "Response from CRML Studio",
              html: `
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;background:#fafafa;padding:48px;">
                <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;overflow:hidden;">
                  <div style="padding:48px;">
                    <h1 style="margin:0;font-size:20px;font-weight:400;color:#111827;">CRML Studio</h1>
                    <p style="margin:6px 0 24px;font-size:13px;color:#6b7280;">Contact Reply</p>
                    <p style="font-size:14px;color:#374151;">Dear ${doc.firstName},</p>
                    <p style="font-size:14px;color:#374151;">We’ve reviewed your message and here’s our reply:</p>
                    <div style="margin:24px 0;padding:16px;border-left:3px solid #111827;background:#fafafa;">
                      <p style="margin:0;font-size:14px;color:#111827;">${doc.reply}</p>
                    </div>
                    <p style="font-size:13px;color:#6b7280;">Best regards, <br> CRML Studio Team</p>
                  </div>
                  <div style="background:#f5f5f5;padding:16px 24px;text-align:center;font-size:12px;color:#9ca3af;">
                    <p style="margin:0;">CRML Studio © ${new Date().getFullYear()}</p>
                  </div>
                </div>
              </div>
              `,
            });

            // ✅ repliedAt 업데이트
            await req.payload.update({
              collection: "contacts",
              id: doc.id,
              data: { repliedAt: new Date() },
            });

            console.log(`📨 Reply sent to ${doc.email}`);
          } catch (err) {
            console.error("❌ Failed to send reply email:", err);
          }
        }
      },
    ],
  },
};