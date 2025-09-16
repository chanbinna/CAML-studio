import { CollectionConfig } from 'payload'

export const FrontBanners: CollectionConfig = {
    slug: 'front-banners',
    labels: {
        singular: 'Front Banner',
        plural: 'Front Banners',
    },
    upload: {
    staticDir: 'media',   // public/media 안에 저장
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
}