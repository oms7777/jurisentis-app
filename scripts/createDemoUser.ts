// ✅ scripts/createDemoUser.ts
import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'
import { generateCode } from '../lib/utils/generateCode'

async function main() {
  const password = await hash('demo123', 10)
  const code = generateCode()

  await prisma.user.upsert({
    where: { email: 'demo@jurisentis.com' },
    update: {
      name: 'Demo User',
      password,
      isActive: false,
      isSandbox: true,
      role: 'clo',
      registrationCode: code,
      registrationCodeExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    },
    create: {
      email: 'demo@jurisentis.com',
      name: 'Demo User',
      password,
      isActive: false,
      isSandbox: true,
      role: 'clo',
      registrationCode: code,
      registrationCodeExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    },
  })

  console.log('✅ Utilisateur démo mis à jour ou créé avec code :', code)
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit())
