import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { prisma } from "@/lib/db";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

function getApp() {
  if (!projectId || !clientEmail || !privateKey) return null;
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export async function sendFcmToUsers(
  userIds: string[],
  payload: { title: string; body: string; link?: string }
) {
  const app = getApp();
  if (!app || userIds.length === 0) return;

  const tokens = await prisma.fcmToken.findMany({ where: { userId: { in: userIds } } });
  if (tokens.length === 0) return;

  const messaging = getMessaging(app);
  const res = await messaging.sendEachForMulticast({
    tokens: tokens.map((t) => t.token),
    notification: { title: payload.title, body: payload.body },
    data: { link: payload.link || "/feed" },
  });

  const deadTokens: string[] = [];
  res.responses.forEach((r, i) => {
    if (!r.success && (r.error?.code === "messaging/registration-token-not-registered" || r.error?.code === "messaging/invalid-registration-token")) {
      deadTokens.push(tokens[i].token);
    }
  });
  if (deadTokens.length > 0) {
    await prisma.fcmToken.deleteMany({ where: { token: { in: deadTokens } } });
  }
}
