import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@elite.local";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name: "إدارة المعهد",
      email,
      passwordHash,
      role: "ADMIN",
      status: "APPROVED",
    },
  });

  console.log("تم إنشاء حساب الإدارة الافتراضي:");
  console.log(`  البريد: ${email}`);
  console.log(`  كلمة المرور: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
