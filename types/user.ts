export interface User {
  id: string
  email: string
  role: string
  isSandbox?: boolean
  isActive?: boolean
  name?: string
  image?: string
  profile?: any
}
