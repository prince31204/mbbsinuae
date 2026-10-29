import "dotenv/config";
import * as bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long");
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing && existing.role !== UserRole.admin) {
    throw new Error(
      `An account already exists for ${email} with role ${existing.role}. No changes made.`
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Super Admin",
      role: UserRole.admin,
      password: hashedPassword,
      designation: "Administrator",
      description: "Platform administrator for MBBS in UAE.",
      status: true,
    },
    create: {
      name: "Super Admin",
      email,
      role: UserRole.admin,
      password: hashedPassword,
      designation: "Administrator",
      description: "Platform administrator for MBBS in UAE.",
      status: true,
    },
    select: { id: true, email: true, role: true, status: true },
  });

  console.log("Admin account ready:", admin);
}

main()
  .catch((error) => {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
