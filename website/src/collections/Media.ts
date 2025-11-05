import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media", // ✅ 이 이름이 relationTo와 일치해야 함
  labels: {
    singular: "Media File",
    plural: "Media Library",
  },
  admin: {
    useAsTitle: "filename",
    group: "Media Management",
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  upload: {
    staticDir: "../media", // 서버에 저장될 실제 폴더 경로
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 400,
        position: "center",
      },
    ],
    adminThumbnail: "thumbnail", // 관리자 썸네일로 표시
    mimeTypes: ["image/*"], // 이미지 전용
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
    },
  ],
};