import { handlers } from "@/lib/auth"

// Force Node.js runtime (bcrypt/Prisma use Node APIs)
export const runtime = 'nodejs'

export const { GET, POST } = handlers
