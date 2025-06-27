// ✅ app/api/auth/send-registration-code/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { email, registrationCode, activationLink } = await req.json()

    if (!email || !registrationCode || !activationLink) {
      return NextResponse.json(
        { message: 'Champs requis manquants.' },
        { status: 400 }
      )
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ SMTP_USER ou SMTP_PASS manquant dans le .env')
      return NextResponse.json(
        { message: '⚠️ Configuration SMTP incomplète' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: `"Jurisentis" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔐 Votre accès démo à Jurisentis',
      html: `
        <p>Bonjour,</p>
        <p>Voici votre lien pour activer l'accès à la plateforme de démonstration :</p>
        <p><strong>Code d'activation :</strong> ${registrationCode}</p>
        <p>🔗 <a href="${activationLink}" target="_blank">${activationLink}</a></p>
        <p>⏳ Ce lien est valable pendant <strong>48 heures</strong>.</p>
        <br/>
        <p>Bien cordialement,<br/>L’équipe Jurisentis</p>
      `,
    }

    console.log('📤 Tentative d’envoi du mail à :', email)

    const info = await transporter.sendMail(mailOptions)

    console.log('✅ Email envoyé ! ID :', info.messageId)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('❌ Erreur lors de l’envoi de l’email :', err?.response || err)
    return NextResponse.json(
      { error: 'Erreur lors de l’envoi de l’email' },
      { status: 500 }
    )
  }
}
