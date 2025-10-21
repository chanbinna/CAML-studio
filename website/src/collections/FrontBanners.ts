import { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const FrontBanners: CollectionConfig = {
    slug: 'front-banners',
    labels: {
        singular: 'Front Banner',
        plural: 'Front Banners',
    },
    admin: {
      group: "Site Contents",
    },
    upload: {
    staticDir: path.resolve(dirname, '../../public/media'),   // public/media 안에 저장
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,              // ✅ 누구나 읽기 가능 (홈에서 보여짐)
    create: ({ req }) => !!req.user, // 로그인 유저만 생성 가능
    update: ({ req }) => !!req.user, // 로그인 유저만 수정 가능
    delete: ({ req }) => !!req.user, // 로그인 유저만 삭제 가능
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
}