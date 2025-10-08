// src/lib/payloadClient.ts
import payload, { getPayload } from "payload";
import config from "@payload-config"; // ✅ Payload 설정파일 import

let cached = null as any;

export async function getPayloadClient() {
  if (cached) return cached;
  cached = await getPayload({ config });
  return cached;
}