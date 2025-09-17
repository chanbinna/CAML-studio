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
    upload: {
    staticDir: path.resolve(dirname, '../../public/media'),   // public/media 안에 저장
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