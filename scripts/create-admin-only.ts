import "dotenv/config";
import * as bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = "amanahlawat1918@gmail.com";
  const password = "Admin@1234";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`SKIPPED: ${email} already exists with role ${existing.role}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "Aman Ahlawat",
      email,
      password: hashedPassword,
      role: UserRole.admin,
      designation: "Administrator",
      description: "Platform administrator",
      status: true,
    },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  console.log("CREATED:", user);
}

main()
  .catch((error) => {
    console.error("FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
