import { CollectionConfig } from "payload";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const Workshops: CollectionConfig = {
  slug: "workshops",
  labels: {
    singular: "Workshop",
    plural: "Workshops",
  },
  admin: {
    useAsTitle: "name",
    group: "Workshop Management",
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    // ✅ 워크숍 이름
    {
      name: "name",
      type: "text",
      required: true,
    },

    // ✅ slug (자동 생성)
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ value, siblingData, operation }) => {
            const src = siblingData?.name as string | undefined;
            if (src && (operation === "create" || operation === "update")) {
              return slugify(src);
            }
            return value;
          },
        ],
      },
    },

    // ✅ 대표 이미지
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Workshop Image",
      required: true,
    },

    // ✅ 설명
    {
      name: "description",
      type: "textarea",
      required: true,
    },

    // ✅ 수강료
    {
      name: "fee",
      type: "number",
      required: true,
      admin: {
        step: 1,
        placeholder: "Enter fee in USD",
      },
    },

    // ✅ 일정 (직접 추가 가능한 배열)
    {
      name: "scheduleOptions",
      label: "Workshop Schedules",
      type: "array", // ✅ 여러 일정 추가 가능
      required: true,
      labels: {
        singular: "Schedule",
        plural: "Schedules",
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Schedule Label",
          required: true,
          admin: {
            placeholder: "e.g. Oct 25 (Sat) 14:00–16:00",
          },
        },
      ],
    },
  ],
};