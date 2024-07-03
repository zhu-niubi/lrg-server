import { Injectable } from '@nestjs/common'
import { CreateProductPackDto } from './dto/create-product-pack.dto'
import { UpdateProductPackDto } from './dto/update-product-pack.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetProductPackDto } from './dto/get-product-pack.dto'
import { SendProductPackDto } from './dto/send-product-pack.dto'
import dayjs from 'dayjs'
import { BuildCode } from 'src/lib/util'

@Injectable()
export class ProductPackService {
  constructor(private prismaService: PrismaService) {}
  create({ products, ...createProductPackDto }: CreateProductPackDto) {
    return this.prismaService.productPack.create({
      data: {
        ...createProductPackDto,
        products: products.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          productSkuId: i.productSkuId,
        })),
      },
    })
  }
  send(sendProductPackDto: SendProductPackDto) {
    return this.prismaService.$transaction(async prisma => {
      const result = await prisma.productPack.findFirst({
        where: { id: sendProductPackDto.productPackId, status: 1 },
      })
      const userPack = await prisma.userProductPack.findFirst({
        where: {
          id: sendProductPackDto.productPackId,
          deadline: {
            gte: dayjs().unix(),
          },
          status: 1,
        },
      })
      if (result.type === 2 && !userPack) {
        throw Error('该用户权益卡还未到期，不能重复发送')
      }
      if (!result) {
        throw Error('找不到该记录')
      }
      if (Array.isArray(result.products)) {
        for (let item of sendProductPackDto.userId) {
          await prisma.userProductPack.create({
            data: {
              products: result.products,
              applyStore: result.applyStore,
              storeId: sendProductPackDto.storeId,
              productPackId: sendProductPackDto.productPackId,
              userId: item,
              deadline: dayjs().add(result.deadlineDay, 'day').unix(),
              memo: sendProductPackDto.memo,
              employeeId: sendProductPackDto.emplpyeeId,
              code: 'P' + BuildCode(),
              userCoupon: {
                createMany: {
                  data: result.products
                    .map((product: any) => {
                      return new Array(product['quantity']).fill('').map(() => {
                        return {
                          deadline: dayjs()
                            .add(result.deadlineDay, 'day')
                            .unix(),
                          userId: item,
                          recommenderId: 0,
                          memo: '权益卡奖励发放',
                          source: 3,
                          code: BuildCode(),
                          usedAt: 0,
                          storeId: 0,
                          orderNumber: '',
                          productId: product.productId,
                          productSkuId: product.productSkuId,
                          applyStore: result.applyStore,
                          employeeId: sendProductPackDto.emplpyeeId,
                          couponTemplateId: 0,
                          createdAt: dayjs().unix(),
                          updatedAt: dayjs().unix(),
                        }
                      })
                    })
                    .flat(),
                },
              },
            },
          })
        }
      }
    })
  }

  async findAll(getProductPackDto: GetProductPackDto) {
    const result = await this.prismaService.table('productPack')({
      pageNumber: getProductPackDto.pageNumber,
      pageSize: getProductPackDto.pageSize,
      where: {
        name: {
          contains: getProductPackDto.name,
        },
        ...(getProductPackDto.storeId
          ? {
              OR: [
                {
                  applyStore: {
                    array_contains: [getProductPackDto.storeId],
                  },
                },
                {
                  applyStore: {
                    array_contains: [0],
                  },
                },
              ],
            }
          : {}),
        type: getProductPackDto.type,
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
    const stores = await this.prismaService.store.findMany({
      where: { id: { in: result.list.map((i: any) => i.applyStore).flat() } },
      select: { id: true, name: true },
    })
    const storeMap = stores.reduce((acc, item) => {
      acc[item.id] = item.name
      return acc
    }, {})
    const productMap = products.reduce((p, c) => {
      p[c.id] = c.name
      return p
    }, {})
    result.list.forEach((i: any) => {
      i.applyStore = i.applyStore.map(j => ({
        id: j,
        name: storeMap[j],
      }))
      i.products.forEach(j => {
        j.productName = productMap[j.productId]
      })
    })

    return result
  }

  async findOne(id: number) {
    const result = await this.prismaService.productPack.findFirst({
      where: { id, status: 1 },
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
    const stores = await this.prismaService.store.findMany({
      where: { id: { in: result.applyStore as [] } },
      select: { id: true, name: true },
    })
    const storeMap = stores.reduce((acc, item) => {
      acc[item.id] = item.name
      return acc
    }, {})
    const productMap = products.reduce((p, c) => {
      p[c.id] = c.name
      return p
    }, {})
    ;(result.products as []).forEach((i: any) => {
      i.productName = productMap[i.productId]
    })
    return {
      ...result,
      applyStore: (result.applyStore as []).map((i: any) => ({
        id: i,
        name: storeMap[i],
      })),
    }
  }

  update(
    id: number,
    { products, ...updateProductPackDto }: UpdateProductPackDto,
  ) {
    return this.prismaService.productPack.update({
      data: {
        ...updateProductPackDto,
        products: products.map(i => ({
          productId: i.productId,
          productSkuId: i.productSkuId,
          quantity: i.quantity,
        })),
      },
      where: { id },
    })
  }

  remove(id: number) {
    return this.prismaService.productPack.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
