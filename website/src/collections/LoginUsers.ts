import { CollectionConfig } from "payload";

export const LoginUsers: CollectionConfig = {
  slug: "login-users",
  admin: {
    group: "User Management",
  },

  auth: {
    useAPIKey: false,

    
    cookies: {
      // @ts-expect-error: Payload type defs don't include `name`, but it works at runtime.
      name: "login-users-token",
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api",
    },
    tokenExpiration: 60 * 60 * 2,
    verify: false,
  },

  fields: [
    { name: "name", type: "text", required: true },
    { name: "lastName", type: "text", required: true },

    {
      name: "cart",
      type: "array",
      label: "Cart",
      fields: [
        { name: "productId", type: "text" },
        { name: "quantity", type: "number", defaultValue: 1 },
        { name: "price", type: "number", required: true },
      ],
    },

    {
      name: "orders",
      type: "array",
      label: "Orders",
      fields: [
        { name: "orderId", type: "text" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "productId", type: "text" },
            { name: "quantity", type: "number" },
            { name: "price", type: "number" },
          ],
        },
        { name: "total", type: "number" },
        {
          name: "purchasedAt",
          type: "date",
          defaultValue: () => new Date(),
        },
      ],
    },
  ],
};