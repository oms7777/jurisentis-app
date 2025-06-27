import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  const { userId, name, password, organization } = await req.json()

  if (!userId || !password || !name) {
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        password: hashedPassword,
        organization,
        isActive: true,
      },
      select: {
        id: true,
        isSandbox: true,
      },
    })

    return NextResponse.json({
      success: true,
      redirectTo: user.isSandbox ? '/demo-login' : '/login',
    })
  } catch (error) {
    console.error('❌ Erreur onboarding :', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
