import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { MD5, exclude } from 'src/lib/util'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetUserDTO } from './dto/get-user.dto'
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async login({ openId, nickname }: { openId: string; nickname?: string }) {
    return this.prismaService.$transaction(async prisma => {
      const record = await prisma.user.findFirst({
        where: { openId, status: 1 },
      })
      if (record) {
        return { ...record, newUser: false }
      }
      const newRecord = await prisma.user.upsert({
        where: {
          openId,
        },
        create: {
          openId,
          area: '',
          avatarUrl: '',
          phoneNumber: '',
          level: 1,
          gender: 1,
          city: '',
          country: '中国',
          birthday: 1,
          name: '',
          province: '',
          nickname,
          status: 1,
          updatedAt: dayjs().unix(),
          createdAt: dayjs().unix(),
        },
        update: {
          nickname,
        },
      })
      return { ...newRecord, newUser: true }
    })
  }

  async adminLogin({
    username,
    password,
  }: {
    username: string
    password: string
  }) {
    const result = await this.prismaService.admin.findFirst({
      where: { username, password: MD5(MD5(password) + process.env.AppSecret) },
    })
    return result
  }

  async findOne(id: number) {
    const result = await this.prismaService.user.findFirst({
      where: { id, status: 1 },
      include: {
        point: {
          select: {
            quantity: true,
          },
        },
      },
    })
    return exclude(
      {
        ...result,
        pointQuantity: result?.point?.quantity || 0,
      },
      'point',
    )
  }

  async findOneUser({
    id,
    phoneNumber,
    openId,
  }: {
    id?: number
    openId?: string
    phoneNumber?: string
  }) {
    const result = await this.prismaService.user.findFirst({
      where: { id, openId, phoneNumber, status: 1 },
      include: {
        point: {
          select: {
            quantity: true,
          },
        },
      },
    })
    return exclude(
      {
        ...result,
        pointQuantity: result?.point?.quantity || 0,
      },
      'point',
    )
  }

  async findManyUser({
    pageSize,
    pageNumber,
    phoneNumber,
    userId,
    openId,
  }: GetUserDTO) {
    const result = await this.prismaService.table('user')({
      pageSize,
      pageNumber,
      include: {
        point: {
          select: {
            quantity: true,
          },
        },
      },
      where: { phoneNumber, id: userId, openId, status: { not: 0 } },
    })
    result.list.forEach((i: any) => {
      i.pointQuantity = i.point?.quantity || 0
      delete i.point
    })
    return result
  }

  async updateUser(
    user: {
      birthday?: number
      avatarUrl?: string
      country?: string
      area?: string
      province?: string
      city?: string
      gender?: number
      name?: string
      nickname?: string
      openId?: string
      phoneNumber?: string
      level?: number
      status?: number
    },
    id: number,
  ) {
    if (!id) {
      return
    }
    return this.prismaService.user.update({
      where: { id },
      select: {
        openId: true,
        nickname: true,
        name: true,
        gender: true,
        avatarUrl: true,
      },
      data: user,
    })
  }

  async createUserByPhoneNmber(phoneNumber: string) {
    const now = dayjs().unix()
    const newRecord = await this.prismaService.user.upsert({
      where: { phoneNumber },
      create: {
        openId: phoneNumber,
        area: '',
        avatarUrl: '',
        phoneNumber,
        level: 1,
        gender: 1,
        city: '',
        country: '中国',
        birthday: 1,
        name: '',
        province: '',
        nickname: '微信用户',
        status: 1,
        updatedAt: now,
        createdAt: now,
      },
      update: {},
    })
    return {
      ...newRecord,
      newUser: now === newRecord.createdAt,
    }
  }

  async mergeUser(openId: string, userId: number, userProps) {
    return this.prismaService.$transaction(async prisma => {
      const result = await prisma.user.findFirst({
        where: { openId, id: { not: userId } },
        select: { phoneNumber: true, id: true },
      })
      if (!result) {
        const userUpdate = await prisma.user.update({
          where: { id: userId },
          data: { openId, ...userProps },
        })
        return { ...userUpdate, merge: false }
      }
      const thisUser = await prisma.user.findFirst({
        where: { id: userId },
        select: { phoneNumber: true },
      })
      const phoneNumber = thisUser.phoneNumber
      await prisma.user.update({
        where: { id: result.id },
        data: { ...userProps, phoneNumber },
      })
      await prisma.user.update({
        where: { id: userId },
        data: {
          phoneNumber: userId.toString(),
          openId: userId.toString(),
          status: 0,
        },
      })
      return { ...result, phoneNumber, merge: true }
    })
  }
  async mergeUserByPhoneNumber(phoneNumber: string, userId: number, userProps) {
    const result = await this.prismaService.$transaction(async prisma => {
      const result = await prisma.user.findFirst({
        where: { phoneNumber, id: { not: userId }, status: 1 },
        select: { phoneNumber: true, id: true },
      })
      if (!result) {
        const userUpdate = await prisma.user.update({
          where: { id: userId },
          data: { phoneNumber, ...userProps },
        })
        return { ...userUpdate, merge: false }
      }
      const thisUser = await prisma.user.update({
        where: { id: userId },
        data: { status: 0 },
      })

      return {
        ...thisUser,
        merge: true,
      }
    })
    if (result.merge) {
      const openId = result.openId
      return this.prismaService.$transaction(async prisma => {
        await prisma.user.update({
          where: { id: result.id },
          data: { openId: result.id.toString() },
        })
        const user = await prisma.user.update({
          where: { phoneNumber },
          data: {
            ...userProps,
            openId,
            avatarUrl: result.avatarUrl,
            area: result.area,
            gender: result.gender,
            nickname: result.nickname,
          },
        })
        return { ...result, ...user }
      })
    } else {
      return result
    }
  }
}
