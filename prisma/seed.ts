import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@loyaltypro.mn' },
    update: {},
    create: {
      name: 'Админ',
      email: 'admin@loyaltypro.mn',
      password,
      role: 'admin',
    },
  })
  console.log('Admin үүсгэлээ:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())