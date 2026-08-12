import webpush from "web-push";
import { prisma } from "@/lib/db";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
  webpush.setVapidDetails("mailto:admin@tawsiya.app", publicKey, privateKey);
}

export async function sendPushToUsers(
  userIds: string[],
  payload: { title: string; body: string; link?: string }
) {
  if (!publicKey || !privateKey || userIds.length === 0) return;

  const subs = await prisma.pushSubscription.findMany({ where: { userId: { in: userIds } } });
  if (subs.length === 0) return;

  const json = JSON.stringify(payload);

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          json
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => null);
        }
      }
    })
  );
}
