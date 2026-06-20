import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'aslahfarhanma@gmail.com';
  const password = 'Aslah@8525';
  
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      email,
      name: 'Aslah Farhan',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('User created/updated successfully:', user.email, 'Role:', user.role);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
