// ✅ /app/api/auth/generate-registration-code/route.ts
import { NextResponse } from 'next/server'
import { generateCode } from '../../../../lib/utils/generateCode'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  const { email, type = 'client' } = await req.json()

  if (!email) {
    return NextResponse.json({ message: 'Email requis' }, { status: 400 })
  }

  const code = generateCode()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48) // 48h
  const activationLink = `${process.env.NEXTAUTH_URL}/activate?code=${code}`

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: {
          registrationCode: code,
          registrationCodeExpiresAt: expiresAt,
        },
      })
    } else {
      await prisma.user.create({
        data: {
          email,
          registrationCode: code,
          registrationCodeExpiresAt: expiresAt,
          isActive: false,
          isSandbox: true,
          role: type === 'admin' ? 'ADMIN' : 'CLIENT',
        },
      })
    }

    // ✅ Envoi de l'email d'activation
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-registration-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, registrationCode: code, activationLink }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('❌ Erreur lors de l’envoi du mail :', error)
    }

    return NextResponse.json({
      success: true,
      registrationCode: code,
      activationLink,
    })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
