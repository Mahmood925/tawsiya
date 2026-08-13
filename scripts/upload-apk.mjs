import { put } from "@vercel/blob/client";
import fs from "fs";

const BASE = "https://tawsiya-oman.vercel.app";
const COOKIE = process.env.SESSION_COOKIE;
if (!COOKIE) throw new Error("Set SESSION_COOKIE env var");

const tokenRes = await fetch(`${BASE}/api/admin/upload-apk`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Cookie: COOKIE },
  body: JSON.stringify({
    type: "blob.generate-client-token",
    payload: {
      pathname: "releases/tawsiya.apk",
      callbackUrl: `${BASE}/api/admin/upload-apk`,
      multipart: false,
      clientPayload: null,
    },
  }),
});

if (!tokenRes.ok) {
  console.error("Token request failed:", tokenRes.status, await tokenRes.text());
  process.exit(1);
}
const { clientToken } = await tokenRes.json();
console.log("Got client token");

const fileBuffer = fs.readFileSync(process.argv[2]);
const blob = await put("releases/tawsiya.apk", fileBuffer, {
  access: "public",
  token: clientToken,
  contentType: "application/vnd.android.package-archive",
});

console.log("Uploaded:", blob.url);
