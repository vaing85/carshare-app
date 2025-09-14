import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isHost?: boolean
      isVerified?: boolean
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    isHost?: boolean
    isVerified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isHost?: boolean
    isVerified?: boolean
  }
}
