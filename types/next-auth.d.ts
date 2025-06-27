// types/next-auth.d.ts
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      isActive: boolean
      isSandbox: boolean
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    isActive: boolean
    isSandbox: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    isActive: boolean
    isSandbox: boolean
  }
}
