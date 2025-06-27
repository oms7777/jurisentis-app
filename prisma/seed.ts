// ✅ prisma/seed.ts
import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'
import { generateCode } from '../lib/utils/generateCode'

async function main() {
  const password = await hash('demo123', 10)

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@jurisentis.com',
        name: 'Admin',
        password,
        isActive: true,
        role: 'admin',
        isSandbox: false,
      },
      {
        email: 'demo@jurisentis.com',
        name: 'CLO Démo',
        password,
        isActive: false,
        role: 'clo',
        isSandbox: true,
        registrationCode: generateCode(),
        registrationCodeExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
      },
      {
        email: 'juriste@jurisentis.com',
        name: 'Juriste',
        password,
        isActive: true,
        role: 'juriste',
        isSandbox: false,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Utilisateurs seedés.')
}

main().catch(console.error).finally(() => process.exit())
