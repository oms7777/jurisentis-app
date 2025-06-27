import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
    CredentialsProvider({
      name: 'Identifiants',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        console.log('📥 Tentative de login avec :', credentials)

        if (!credentials?.email || !credentials?.password) {
          console.warn('❌ Email ou mot de passe manquant.')
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          console.warn('❌ Aucun utilisateur trouvé avec cet email.')
          return null
        }

        if (!user.password) {
          console.warn('❌ Mot de passe absent dans la base pour cet utilisateur.')
          return null
        }

        console.log('🔐 Mot de passe en base :', user.password)

        const passwordMatch = await compare(credentials.password, user.password)

        if (!passwordMatch) {
          console.warn('❌ Mot de passe incorrect.')
          return null
        }

        console.log('✅ Authentification réussie pour :', user.email)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
          isSandbox: user.isSandbox,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isActive = (user as any).isActive ?? false
        token.isSandbox = (user as any).isSandbox ?? false
      } else {
        const userInDb = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isActive: true, isSandbox: true },
        })
        token.isActive = userInDb?.isActive ?? false
        token.isSandbox = userInDb?.isSandbox ?? false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.isActive = token.isActive
        session.user.isSandbox = token.isSandbox
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}
