import { prisma } from "@/lib/db";
import { sendPushToUsers } from "@/lib/push";

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
  await sendPushToUsers([userId], { title, body, link });
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
  await sendPushToUsers(userIds, { title, body, link });
}
