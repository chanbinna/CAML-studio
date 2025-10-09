import { CollectionConfig } from "payload";

export const LoginUsers: CollectionConfig = {
  slug: "login-users",

  auth: {
    // ✅ 고객용 인증 활성화
    useAPIKey: false,

    // ✅ 쿠키 이름을 관리자(Admin)와 분리
    cookies: {
      name: "login-users-token", // 💡 고객용 세션 쿠키 이름
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },

    // ✅ 세션(자동 로그인 유지) 설정
    tokenExpiration: 60 * 60 * 24 * 7, // 7일 (초 단위)
    verify: false, // 이메일 인증 비활성화 (원하면 true로 변경 가능)
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