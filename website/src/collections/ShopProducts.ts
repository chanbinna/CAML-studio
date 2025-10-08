import { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // 공백 → 하이픈
    .replace(/[^a-z0-9-]/g, ""); // 특수문자 제거

export const ShopProducts: CollectionConfig = {
  slug: "shopProducts", // API 엔드포인트: /api/shop-products
  labels: {
    singular: "Shop Product",
    plural: "Shop Products",
  },
  admin: {
    useAsTitle: "name",   // ✅ Admin 리스트/검색에서 name을 대표 필드로 사용
    defaultColumns: ["filename", "name", "category", "price", "color", "size"],
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
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        readOnly: true, // 관리자 수정 불가
      },
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
      relationTo: "shopCategories" , // ✅ Shop Categories 컬렉션과 연결
      required: true,
    },

    
  ],
};