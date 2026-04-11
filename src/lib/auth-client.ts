import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000" // the server URL
})

export const { useSession, signIn, signUp, signOut } = authClient
