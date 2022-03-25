import { PrismaClient } from "@prisma/client";
import { link } from "fs";
import { links } from "../data/links";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "asolyma@hotmail.com",
      role: "Admin",
      password: "123456",
    },
  });
  await prisma.link.createMany({
    data: [...links],
  });
}
main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
