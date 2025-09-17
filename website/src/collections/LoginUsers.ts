import { CollectionConfig } from 'payload'

export const LoginUsers: CollectionConfig = {
  slug: 'login-users',   // ✅ 여기 이름이 곧 API 경로가 돼요
  auth: {
    forgotPassword: {
      // 옵션은 비워도 되고 필요하면 커스터마이즈 가능
      // expiration: 3600, // 토큰 만료 시간 (초 단위, 기본 1시간)
    },
  },           // ✅ 인증 기능 활성화
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'cart',
      type: 'array',
      label: 'Cart',
      fields: [
        {
          name: 'productId',
          type: 'text', // 또는 relationTo: 'products' (상품 컬렉션과 연결 가능)
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'orders',
      type: 'array',
      label: 'Orders',
      fields: [
        {
          name: 'orderId',
          type: 'text',
        },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'productId', type: 'text' },
            { name: 'quantity', type: 'number' },
            { name: 'price', type: 'number' },
          ],
        },
        {
          name: 'total',
          type: 'number',
        },
        {
          name: 'purchasedAt',
          type: 'date', // ✅ 구매일자
          defaultValue: () => new Date(), // 기본값: 현재 시간
        },
      ],
    },
  ],
}