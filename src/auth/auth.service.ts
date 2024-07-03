import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { admin, store } from '@prisma/client'
import { MD5 } from 'src/lib/util'
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validataAdmin({
    username,
    password,
    website,
  }: {
    username: string
    password: string
    website: 'admin' | 'store' | 'client'
  }) {
    if (website === 'admin') {
      const result = await this.prismaService.admin.findFirst({
        where: { username },
      })
      if (
        result &&
        result.password === MD5(MD5(password) + process.env.AppSecret)
      ) {
        return this.sign({ id: result.id, website })
      }

      throw Error('账号/密码错误')
    }
    if (website === 'store') {
      const result = await this.prismaService.employee.findFirst({
        where: { username },
      })
      if (
        result &&
        result.password === MD5(MD5(password) + process.env.AppSecret)
      ) {
        result.password = null
        return this.sign({
          id: result.id,
          storeId: result.storeId,
          website,
          position: result.position,
        })
      }
      throw Error('账号/密码错误')
    }
  }

  sign(
    user: Omit<admin | { id: number } | store, 'password'> & {
      website: string
      storeId?: number
      position?: number
    },
  ) {
    return {
      token: this.jwtService.sign(user),
      ...user,
    }
  }
}
