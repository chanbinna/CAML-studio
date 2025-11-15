import { CollectionConfig } from "payload";

export const ShopOrders: CollectionConfig = {
  slug: "orders",
  labels: {
    singular: "Shop Order",
    plural: "Shop Orders",
  },
  admin: {
    group: "Shop Management",
    useAsTitle: "orderId",
    defaultColumns: ["orderId", "userEmail", "total", "status", "purchasedAt"],
  },
  access: {
    read: ({ req }) => !!req.user, // 관리자만 접근 가능 (나중에 role로 세분화 가능)
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "orderId",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "userId",
      type: "text",
      required: true,
    },
    {
      name: "userEmail",
      type: "text",
    },

    {
      name: "shippingAddress",
      type: "group",
      fields: [
        { name: "line1", type: "text" },
        { name: "line2", type: "text" },
        { name: "city", type: "text" },
        { name: "state", type: "text" },
        { name: "postal_code", type: "text" },
        { name: "country", type: "text" },
      ],
    },

    {
      name: "items",
      type: "array",
      fields: [
        { name: "productId", type: "text" },
        { name: "quantity", type: "number" },
        { name: "price", type: "number" },
      ],
    },
    {
      name: "total",
      type: "number",
    },
    {
      name: "status",
      type: "select",
      options: ["pending", "paid", "shipped", "delivered", "cancelled"],
      defaultValue: "paid",
    },
    {
      name: "purchasedAt",
      type: "date",
      defaultValue: () => new Date(),
    },
  ],
};