import { Injectable } from '@nestjs/common'
import { MD5 } from 'src/lib/util'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { GetEmployeeDto } from './dto/get-employee.dto'

@Injectable()
export class EmployeeService {
  constructor(private prismaService: PrismaService) {}
  async getAll({
    pageNumber,
    pageSize,
    storeId,
    phoneNumber,
    name,
    position,
    star,
  }: GetEmployeeDto) {
    const result = await this.prismaService.table('employee')({
      pageNumber,
      pageSize,
      include: {
        store: {
          select: {
            name: true,
          },
        },
      },
      where: {
        status: 1,
        storeId,
        star,
        phoneNumber: {
          contains: phoneNumber,
        },
        name,
        position,
      },
    })
    result.list.forEach((i: any) => {
      i.storeName = i.store.name
      delete i.store
      delete i.password
    })
    return result
  }

  async getOne(id: number) {
    return this.prismaService.employee.findFirst({ where: { id } })
  }

  async login({ username, password }: { username: string; password: string }) {
    return this.prismaService.employee.findFirst({
      where: {
        username,
        password: MD5(MD5(password) + process.env.AppSecret),
        status: 1,
      },
    })
  }

  async resetPass({
    oldPassword,
    newPassword,
    userId,
  }: {
    newPassword: string
    oldPassword: string
    userId: number
  }) {
    return this.prismaService.$transaction(async prisma => {
      const userRecord = await prisma.employee.findFirst({
        where: { id: userId },
      })
      if (!userRecord) throw new Error('用户不存在')
      if (
        userRecord.password !== MD5(MD5(oldPassword) + process.env.AppSecret)
      ) {
        throw new Error('密码不正确')
      }
      return prisma.employee.update({
        where: { id: userId },
        data: { password: MD5(MD5(newPassword) + process.env.AppSecret) },
      })
    })
  }

  async addOne({
    image,
    position,
    name,
    phoneNumber,
    username,
    storeId,
    serviceNumber,
    star,
    nickname,
    level,
    employeementAt,
  }: CreateEmployeeDto) {
    return await this.prismaService.employee.create({
      data: {
        password: MD5(MD5('abc123') + process.env.AppSecret),
        position,
        image,
        name,
        phoneNumber,
        username,
        serviceNumber,
        star,
        nickname,
        level,
        employeementAt,
        store: {
          connect: {
            id: storeId,
          },
        },
      },
    })
  }

  editOne(
    {
      image,
      position,
      name,
      phoneNumber,
      username,
      storeId,
      password,
      serviceNumber,
      star,
      nickname,
      level,
      employeementAt,
    }: UpdateEmployeeDto,
    id: number,
  ) {
    return this.prismaService.employee.update({
      where: { id },
      data: {
        image,
        position,
        password: password
          ? MD5(MD5(password) + process.env.AppSecret)
          : undefined,
        name,
        phoneNumber,
        username,
        storeId,
        serviceNumber,
        star,
        nickname,
        level,
        employeementAt,
      },
    })
  }

  deleteOne(id: number) {
    return this.prismaService.employee.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
