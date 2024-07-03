import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { phoneCheck } from 'src/lib/testing'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserCarService {
  constructor(private prismaService: PrismaService) {}
  async getAll({
    pageNumber,
    pageSize,
    keyword,
  }: {
    pageSize?: number
    pageNumber?: number
    keyword?: string
  }) {
    const result = await this.prismaService
      .table('userCar')({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              phoneNumber: true,
            },
          },
          car: {
            select: {
              name: true,
              carBrand: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
        where: {
          OR: keyword && [
            { user: { phoneNumber: keyword } },
            { carNumber: { contains: keyword } },
            { VIN: { contains: keyword } },
          ],
          status: 1,
        },
        pageNumber,
        pageSize,
      })
      .then(result => {
        const list = result.list.map((i: any) => {
          return {
            ...i,
            carName: i.car.name,
            carBrandId: i.car.carBrand.id,
            userName: i.user.name,
            phoneNumber: i.user.phoneNumber,
            carBrand: i.car.carBrand.name,
            car: undefined,
            user: undefined,
          }
        })
        return { ...result, list }
      })
    result.list.forEach((i: any) => {
      i.phoneNumber = phoneCheck('+86', i.phoneNumber)
        ? i.phoneNumber.slice(0, 3) + '****' + i.phoneNumber.slice(-4)
        : i.phoneNumber
    })
    return result
  }

  getUserCar({ userId, id }: { userId?: number; id?: number }) {
    return this.prismaService.userCar
      .findMany({
        include: {
          user: {
            select: {
              name: true,
              phoneNumber: true,
            },
          },
          car: {
            select: {
              name: true,
              carBrand: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
        where: {
          status: 1,
          userId,
          id,
        },
      })
      .then(result =>
        result.map(i => {
          return {
            ...i,
            carName: i.car.name,
            userName: i.user.name,
            phoneNumber: i.user.phoneNumber,
            carBrand: i.car.carBrand.name,
            car: undefined,
            user: undefined,
          }
        }),
      )
  }
  async addUserCar({
    phoneNumber,
    ...data
  }: {
    carNumber: string
    color: string
    carId: number
    VIN: string
    userId?: number
    phoneNumber?: string
  }) {
    if (phoneNumber) {
      return this.prismaService.$transaction(async prisma => {
        const result = await prisma.user.upsert({
          where: {
            phoneNumber,
          },
          update: {},
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
            nickname: '',
            createdAt: dayjs().unix(),
            updatedAt: dayjs().unix(),
            status: 1,
          },
          select: { id: true },
        })
        return prisma.userCar.create({ data: { ...data, userId: result.id } })
      })
    }
    return this.prismaService.userCar.create({
      data: {
        ...data,
        carNumber: data.carNumber.toLocaleUpperCase(),
        userId: data.userId as number,
      },
    })
  }
  editOneByUserId(
    userCar: {
      carNumber?: string
      color?: string
      carId?: number
      VIN?: string
      userId?: number
    },
    id: number,
  ) {
    return this.prismaService.userCar.update({
      where: { id },
      data: userCar,
    })
  }
  deleteOneByUserId(id: number) {
    return this.prismaService.userCar.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
