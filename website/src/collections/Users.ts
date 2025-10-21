import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'Admin',

  admin: {
    useAsTitle: 'email',
    group: "User Management",
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
