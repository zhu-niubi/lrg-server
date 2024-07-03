import { DbClient } from '@lib/nalinv-db'

export interface User {
  id: number
  storeId?: number
  website?: string
  position?: number
}

declare global {
  namespace Express {
    interface Request {
      client: DbClient
      context: {
        user: User
      }
    }
  }
}

export interface ResultForFindAndCount<T> {
  pageSize: number
  pageNumber: number
  totalNumber: number
  data: T[]
}
