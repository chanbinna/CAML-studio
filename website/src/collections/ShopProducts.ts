import { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export const ShopProducts: CollectionConfig = {
  slug: "shopProducts",
  labels: {
    singular: "Shop Product",
    plural: "Shop Products",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "stock"],
    group: "Shop Management",
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  upload: {
    staticDir: path.resolve(dirname, "../../public/media/products"),
    mimeTypes: ["image/*"],
  },

  fields: [
    // ─── 기본 상품 정보 ───
    {
      name: "name",
      type: "text",
      required: true,
    },
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
    {
      name: "price",
      type: "number",
      required: true,
    },
    {
      name: "color",
      type: "text",
    },
    {
      name: "size",
      type: "text",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "shopCategories",
      required: true,
    },

    // ─── 현재 재고 ───
    {
      name: "stock",
      type: "number",
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        description: "현재 남은 재고 (inventory 합계로 자동 계산)",
        readOnly: true,
      },
    },

    // ─── 입고/출고 이력 ───
    {
      name: "inventory",
      type: "array",
      labels: { singular: "Stock Entry", plural: "Inventory History" },
      admin: {
        description: "입출고 이력입니다. quantity 합계가 stock으로 자동 반영됩니다.",
      },
      fields: [
        {
          name: "quantity",
          type: "number",
          required: true,
          admin: { placeholder: "+입고 / -출고" },
        },
        {
          name: "addedAt",
          type: "date",
          required: true,
          defaultValue: () => new Date(),
        },
        {
          name: "note",
          type: "textarea",
        },
      ],
    },
  ],

  // ✅ 핵심: 저장 직전에 stock을 inventory 합계로 갱신
  hooks: {
    beforeChange: [
      async ({ data, originalDoc }) => {
        // inventory가 이번 요청에서 왔으면 그걸, 아니면 기존 데이터를 사용
        const inv =
          (data?.inventory ??
            (originalDoc?.inventory ?? [])) as Array<{ quantity?: number }>;

        // 합계 계산
        const totalStock = inv.reduce(
          (sum, entry) => sum + (Number(entry.quantity) || 0),
          0
        );

        // data가 undefined일 수 있으니 복사
        const next = { ...(data || {}) };
        next.stock = Math.max(0, totalStock); // 음수 방지 (선택적)
        return next;
      },
    ],
  },
};