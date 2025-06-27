// ✅ app/api/auth/validate-registration-code/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  const { code } = await req.json()

  const user = await prisma.user.findFirst({
    where: {
      registrationCode: code,
      registrationCodeExpiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      role: true,
      isSandbox: true,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'Code invalide ou expiré' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isActive: true,
      registrationCode: null,
      registrationCodeExpiresAt: null,
    },
  })

  return NextResponse.json({
    success: true,
    userId: user.id,
    role: user.role ?? null,
    isSandbox: user.isSandbox,
  })
}
