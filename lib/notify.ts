import { prisma } from "@/lib/db";
import { sendPushToUsers } from "@/lib/push";
import { sendFcmToUsers } from "@/lib/fcm";

export type NotificationType =
  | "NEW_POST"
  | "NEW_COMMENT"
  | "NEW_LIKE"
  | "ACCOUNT_APPROVED"
  | "ACCOUNT_REJECTED";

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  link?: string
) {
  const notification = await prisma.notification.create({
    data: { userId, type, title, body, link },
  });
  await Promise.all([
    sendPushToUsers([userId], { title, body, link }),
    sendFcmToUsers([userId], { title, body, link }),
  ]);
  return notification;
}

export async function notifyMany(
  userIds: string[],
  type: NotificationType,
  title: string,
  body: string,
  link?: string
) {
  if (userIds.length === 0) return;
  await prisma.notification.createMany({
    data: userIds.map((userId) => ({ userId, type, title, body, link })),
  });
  await Promise.all([
    sendPushToUsers(userIds, { title, body, link }),
    sendFcmToUsers(userIds, { title, body, link }),
  ]);
}
