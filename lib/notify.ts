import { prisma } from "@/lib/db";

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
  return prisma.notification.create({
    data: { userId, type, title, body, link },
  });
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
}
