import { CollectionConfig } from "payload";
import { ExportSingleWorkshopButton } from "@/components/admin/ExportReservationsButton";

export const WorkshopReservations: CollectionConfig = {
  slug: "workshop-reservations",
  admin: {
    // 🔽 기존: useAsTitle: "workshop",
    useAsTitle: "schedule", // ✅ 간단하고 확실한 방법
    group: "Workshop Management",
    defaultColumns: ["workshop", "schedule", "totalAttendees"],
    components: {
      edit: {
        beforeDocumentControls: [ExportSingleWorkshopButton as any],
      },
    },
  },
  fields: [
    {
      name: "workshop",
      type: "text",
      required: true,
    },
    { name: "schedule", type: "text", required: true },
    {
      name: "attendees",
      type: "array",
      label: "Attendees",
      fields: [
        { name: "user", type: "text" },
        { name: "firstName", type: "text" },
        { name: "lastName", type: "text" },
        { name: "userEmail", type: "email" },
        { name: "fee", type: "number" },
        {
          name: "reservedAt",
          type: "date",
          defaultValue: () => new Date(),
        },
      ],
    },
    // {
    //   name: "totalAttendees",
    //   type: "number",
    //   admin: {
    //     readOnly: true,
    //     description: "Automatically calculated attendee count",
    //   },
      
    //   // hooks: {
    //   //   beforeValidate: [
    //   //     ({ data }) => {
    //   //       if (!data) return data;
    //   //       data.totalAttendees = data.attendees?.length || 0;
    //   //       return data;
    //   //     },
    //   //   ],
    //   // },
    // },
  ],
};