import { Injectable } from '@nestjs/common'
import { CreateUserProductPackDto } from './dto/create-user-product-pack.dto'
import { UpdateUserProductPackDto } from './dto/update-user-product-pack.dto'
import { GetUserProductPackDto } from './dto/get-user-product-pack.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserProductPackService {
  constructor(private prismaService: PrismaService) {}
  create(createUserProductPackDto: CreateUserProductPackDto) {
    return 'This action adds a new userProductPack'
  }

  async findAll(getUserProductPackDto: GetUserProductPackDto) {
    const result = await this.prismaService.table('userProductPack')({
      pageNumber: getUserProductPackDto.pageNumber,
      pageSize: getUserProductPackDto.pageSize,
      include: {
        user: {
          select: { name: true },
        },
        employee: {
          select: { name: true },
        },
        productPack: {
          select: { name: true, pictrue: true },
        },
      },
      where: {
        productPack: {
          id: getUserProductPackDto.productPackId,
        },
        storeId: getUserProductPackDto.storeId,
        employeeId: getUserProductPackDto.employeeId,
        user: {
          phoneNumber: getUserProductPackDto.phoneNumber,
        },
        userId: getUserProductPackDto.userId,
        createdAt: {
          gte: getUserProductPackDto.startTime,
          lte: getUserProductPackDto.endTime,
        },
        applyStore: { array_contains: getUserProductPackDto.applyStore },
        status: 1,
      },
    })
    const products = await this.prismaService.product.findMany({
      select: { name: true, id: true },
      where: {
        id: {
          in: result.list
            .map((i: any) => i.products.map(j => j.productId))
            .flat(),
        },
        status: 1,
      },
    })
    const productMap = products.reduce((p, c) => {
      p[c.id] = c.name
      return p
    }, {})

    const stores = await this.prismaService.store.findMany({
      where: {
        id: {
          in: result.list
            .map((i: any) => {
              return [...i.applyStore, i.storeId]
            })
            .flat(),
        },
      },
      select: { name: true, id: true },
    })

    const storeMap = stores.reduce((acc, item) => {
      acc[item.id] = item.name
      return acc
    }, {})

    result.list.forEach((i: any) => {
      i.applyStore = i.applyStore.map(j => ({
        id: j,
        name: storeMap[j],
      }))
      i.products.forEach(j => {
        j.productName = productMap[j.productId]
      })
      i.storeName = storeMap[i.storeId]

      i.userName = i.user.name
      i.employeeName = i.employee.name
      i.productPackName = i.productPack.name
      i.productPackPictrue = i.productPack.pictrue
      delete i.store
      delete i.productPack
      delete i.employee
      delete i.user
    })

    return result
  }

  async findOne(id: number) {
    const result = await this.prismaService.userProductPack.findFirst({
      where: { id },
      include: {
        user: {
          select: { name: true },
        },
        store: {
          select: { name: true },
        },
        productPack: {
          select: { name: true, pictrue: true },
        },
        userCoupon: {
          select: {
            id: true,
            createdAt: true,
            code: true,
            status: true,
            usedAt: true,
            deadline: true,
            productId: true,
            productSkuId: true,
          },
        },
      },
    })
    const products = await this.prismaService.product.findMany({
      select: { name: true, id: true },
      where: {
        id: {
          in: (result.products as []).map((i: any) => i.productId).flat(),
        },
        status: 1,
      },
    })
    const productMap = products.reduce((p, c) => {
      p[c.id] = c.name
      return p
    }, {})
    ;(result.products as []).forEach((i: any) => {
      i.productName = productMap[i.productId]
    })
    return {
      ...result,
      productPackName: result.productPack.name,
      productPackPictrue: result.productPack.pictrue,
      userName: result.user.name,
      storeName: result.store.name,
      productPack: undefined,
      user: undefined,
      store: undefined,
    }
  }

  update(id: number, updateUserProductPackDto: UpdateUserProductPackDto) {
    return this.prismaService.userProductPack.update({
      where: { id },
      data: updateUserProductPackDto,
    })
  }

  remove(id: number) {
    return this.prismaService.userProductPack.update({
      where: { id },
      data: {
        status: 0,
        userCoupon: {
          updateMany: {
            where: {},
            data: {
              status: 0,
            },
          },
        },
      },
    })
  }
}
