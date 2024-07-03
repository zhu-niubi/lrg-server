import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import http from 'http-status-codes'
import { sign, verify } from 'jsonwebtoken'
import { User } from 'src/types/global'

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const AppSecret: any = process.env.AppSecret
    const token = req.headers.authorization
    if (token === undefined || token === '') {
      res.status(http.UNAUTHORIZED).send('身份信息已经过期')
      return
    } else {
      const newToken = token.replace('Bearer ', '')
      try {
        const { User }: any = verify(newToken, AppSecret)
        req.context = {
          user: User,
        }
        next()
      } catch (err) {
        if (process.env.adminToken === newToken) {
          req.context = {
            user: {
              id: 0,
            },
          }
          next()
        } else res.status(http.UNAUTHORIZED).send('')
      }
    }
  }
}

export const JwtParse = (token: string) => {
  const AppSecret: any = process.env.AppSecret
  return verify(token, AppSecret)
}

export const JwtSign = (
  User: User,
  expiresIn = '2d',
  role?: string,
): string => {
  const AppSecret: any = process.env.AppSecret
  return sign({ User, role }, AppSecret, { expiresIn })
}
