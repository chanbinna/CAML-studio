import { CollectionConfig } from "payload";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");


export const ShopCategories: CollectionConfig = {
  slug: "shopCategories", // API 엔드포인트: /api/shop-categories
  labels: {
    singular: "Shop Category", // Admin 단수
    plural: "Shop Categories", // Admin 복수
  },
  admin: {
    useAsTitle: "name",   
    group: "Shop Management",
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },


  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: { readOnly: true }, // 자동 채우므로 입력 불가 처리
      hooks: {
        beforeValidate: [
          ({ value, siblingData, operation }) => {
            // name 기준으로 slug 자동 생성
            const src = siblingData?.name as string | undefined;
            if (src && (operation === "create" || operation === "update")) {
              return slugify(src);
            }
            return value; // 필드 훅은 "값"을 반환해야 함
          },
        ],
      },
    },
  ],
};