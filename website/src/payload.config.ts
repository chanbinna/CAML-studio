// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";

import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { FrontBanners } from "./collections/FrontBanners";
import { LoginUsers } from "./collections/LoginUsers";
import { ShopProducts } from "./collections/ShopProducts";
import { ShopCategories } from "./collections/ShopCategories";
import { ShopOrders } from "./collections/ShopOrders"
import { Contacts } from "./collections/Contacts";
import { Workshops } from "./collections/Workshop";
import { Media } from "./collections/Media";
import { WorkshopReservations } from "./collections/WorkshopReservations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, FrontBanners, LoginUsers, ShopProducts, ShopCategories, ShopOrders, Contacts,  Workshops, Media, WorkshopReservations],
  cookiePrefix: "crml",
  

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER!,
    defaultFromName: "Carmel Studio",
    transportOptions: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),

  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  cors: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],

  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  
});