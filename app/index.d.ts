import { Prisma } from '@prisma/client'
declare global {
  namespace Express {
    export interface Request {
      id: string
      timestamp: number
      token?: string
      user?: Prisma.UserGetPayload
    }
    export interface Response {
      contentBody: string | Record<string, unknown>
    }
  }
}

export {}
