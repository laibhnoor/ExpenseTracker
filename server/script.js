// script.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@gmail.com",
      passwordHash: "123456",
    },
  });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());