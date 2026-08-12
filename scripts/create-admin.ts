import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3];
  const name = process.argv[4] || "مدير الموقع";

  if (!email || !password) {
    console.error("Usage: tsx scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", status: "APPROVED", name },
    create: { email, passwordHash, role: "ADMIN", status: "APPROVED", name },
  });

  console.log(`Admin ready: ${user.email} (role=${user.role}, status=${user.status})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
