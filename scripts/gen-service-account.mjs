import fs from "fs";
import os from "os";
import path from "path";

const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".config/configstore/firebase-tools.json"), "utf8"));
const token = cfg.tokens.access_token;
const email = "firebase-adminsdk-fbsvc@tawsiya-fcc92.iam.gserviceaccount.com";

const res = await fetch(
  `https://iam.googleapis.com/v1/projects/tawsiya-fcc92/serviceAccounts/${email}/keys`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ privateKeyType: "TYPE_GOOGLE_CREDENTIALS_FILE", keyAlgorithm: "KEY_ALG_RSA_2048" }),
  }
);
const data = await res.json();
if (!res.ok) {
  console.error("ERROR", res.status, JSON.stringify(data));
  process.exit(1);
}
const jsonKey = Buffer.from(data.privateKeyData, "base64").toString("utf8");
const outPath = path.join(process.cwd(), "firebase-service-account.json");
fs.writeFileSync(outPath, jsonKey);
console.log("Key saved to", outPath, "length:", jsonKey.length);
