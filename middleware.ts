import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { JWT } from 'next-auth/jwt'

export default withAuth({
  callbacks: {
    authorized: async ({ token, req }: { token: JWT | null; req: NextRequest }) => {
      // Pas connecté
      if (!token?.id) return false

      // Inactif
      if (!token.isActive) return false

      return true
    },
  },
  pages: {
    signIn: '/login',
  },
})


export const config = {
  matcher: [
    '/dashboard/:path*',
    '/xdraft/:path*',
    '/xvault/:path*',
    '/xlegal/:path*',
    '/xcomply/:path*',
    '/juriscope/:path*',
    '/echeances/:path*',
    '/admin/:path*',
  ],
}
