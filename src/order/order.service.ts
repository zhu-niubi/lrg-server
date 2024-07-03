import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma } from 'prisma/prisma-client'
import { CreateOrderDTO } from './dto/create-order.dto'
import { BuildOrderNumber } from 'src/lib/util'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { GetOrderDTO } from './dto/get-order.dto'
import { Decimal } from '@prisma/client/runtime/library'
import { UsedOrderDTO } from './dto/used-order.dto'
import { SocketService } from '@controller/ws/message.gateway'

@Injectable()
export class OrderService {
  constructor(
    @InjectQueue('orderQueue') private orderQueue: Queue,
    private prismaService: PrismaService,
    private socketService: SocketService,
  ) {}

  async getAll({
    pageNumber,
    pageSize,
    userId,
    status,
    orderNumber,
    startTime,
    endTime,
    productId,
    storeId,
    payStage,
    isPoint,
  }: GetOrderDTO) {
    const result = await this.prismaService.table('order')({
      pageNumber,
      pageSize,
      include: {
        orderSku: {
          select: {
            orderSkuNumber: true,
            id: true,
            amount: true,
            productSku: {
              select: {
                id: true,
                name: true,
                price: true,
                point: true,
                pointStatus: true,
                product: {
                  select: {
                    name: true,
                    id: true,
                    banners: true,
                  },
                },
              },
            },
            store: {
              select: { name: true },
            },
          },
          where: { storeId },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      where: {
        status,
        userId,
        orderNumber,
        payStage,
        isPoint,
        orderSku: {
          some: {
            productSku: {
              productId,
            },
            storeId,
          },
        },
        createdAt: {
          gte: startTime,
          lte: endTime,
        },
      },
      orderBy: {
        id: 'desc',
      },
    })
    result.list.forEach((i: any) => {
      i.userName = i.user.name
      delete i.user
      i.orderSku.forEach(j => {
        j.storeName = j.store?.name
        j.productName = j.productSku.product.name
        j.productId = j.productSku.product.id
        j.productSkuName = j.productSku.name
        j.point = j.productSku.point
        j.pointStatus = j.productSku.pointStatus
        j.productSkuPrice = j.productSku.price
        j.productBanner = j.productSku.product.banners
        j.productSkuId = j.productSku.id
        delete j.productSku
        delete j.store
      })
    })
    return result
  }

  async getOne(id?: number, orderNumber?: string) {
    const { user, ...result } = await this.prismaService.order.findFirst({
      include: {
        orderSku: {
          include: {
            productSku: {
              select: {
                id: true,
                name: true,
                price: true,
                point: true,
                pointStatus: true,
                product: {
                  select: {
                    name: true,
                    id: true,
                    banners: true,
                    applyStore: true,
                  },
                },
              },
            },
            store: {
              select: { name: true },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        pointRecord: {
          select: {
            quantity: true,
            memo: true,
          },
        },
        payment: true,
      },
      where: {
        id,
        orderNumber,
      },
    })
    if (orderNumber) {
      await this.socketService.usedCoupon(result.userId, orderNumber, 1)
    }
    let applyStore = result.orderSku[0].productSku.product
      .applyStore as number[]
    let applyStoreName = ''
    if (applyStore.includes(0)) {
      applyStoreName = '全部门店'
    } else {
      let store = await this.prismaService.store.findMany({
        select: { name: true, id: true },
        where: {
          id: {
            in: result.orderSku[0].productSku.product.applyStore as number[],
          },
        },
      })
      applyStoreName = store.map(i => i.name).join('、')
    }
    result?.orderSku.map((j: any) => {
      j.productName = j.productSku.product.name
      j.storeName = j.productSku.store?.name
      j.productId = j.productSku.product.id
      j.productBanner = j.productSku.product.banners
      j.productSkuName = j.productSku.name
      j.productSkuPrice = j.productSku.price
      j.point = j.productSku.point
      j.pointStatus = j.productSku.pointStatus
      j.productSkuId = j.productSku.id
      delete j.productSku
    })

    return { ...result, userName: user?.name, applyStore: applyStoreName }
  }

  /**
   *
   * @param price   手动设置的价格
   * @param isPoint 是否积分兑换
   * @returns
   */

  async addOne({
    skuOrders,
    userId,
    isPoint,
    price,
    otherFees,
    ...body
  }: CreateOrderDTO) {
    const now = dayjs().unix()
    const resultProduct = await this.prismaService.product.findMany({
      select: {
        id: true,
        name: true,
        productSku: {
          select: {
            id: true,
            price: true,
            point: true,
            name: true,
          },
          where: {
            id: { in: skuOrders.map(i => i.productSkuId) },
          },
        },
      },
      where: {
        productSku: {
          some: {
            id: { in: skuOrders.map(i => i.productSkuId) },
          },
        },
      },
    })
    const orderNumber = BuildOrderNumber() //sku
    const manyOrderSku = skuOrders
      .map((i, index) => {
        const newJson = resultProduct.find(j =>
          j.productSku.find(k => k.id === i.productSkuId),
        )
        const json = newJson.productSku.find(j => j.id === i.productSkuId)
        return new Array(i.productCount || 1).fill({
          ...i,
          productCount: 1,
          amount: json.price,
          orderSkuNumber: `${orderNumber}-${index + 1}`,
          completeAt: now,
          createdAt: now,
          updatedAt: now,
          useStatus: 0,
          storeId: body.storeId || 0,
          usedAt: 0,
        })
      })
      .flat()
    let pointQuantity = 0
    for (let j of resultProduct) {
      pointQuantity += j.productSku.reduce((a, b) => (a += b.point), 0)
    }
    return this.prismaService.$transaction(async prisma => {
      const point = await prisma.point.findFirst({
        where: { userId },
        select: { quantity: true },
      })
      const sum = manyOrderSku
        .reduce((p, c) => {
          return p.add(c.amount)
        }, new Decimal(0))
        .add(otherFees)
        .toNumber()
      let result
      if (isPoint) {
        if (point.quantity < pointQuantity) {
          throw Error('积分不足')
        }
        //如果积分足够抵扣金额，就完成付款，不需要走付款步骤。
        result = await prisma.order.create({
          data: {
            payStage: 3,
            amount: sum,
            origin: 1,
            completeAt: now,
            otherFees,
            user: {
              connect: { id: userId },
            },
            deleteAt: 0,
            isPoint,
            deleteReason: '',
            status: 1,
            orderNumber,
            deadline: 0,
            orderSku: {
              createMany: { data: manyOrderSku },
            },
          },
          select: {
            id: true,
          },
        })
        await Promise.all([
          prisma.point.update({
            where: { userId },
            data: {
              quantity: point.quantity - pointQuantity,
            },
          }),
          prisma.pointRecord.create({
            data: {
              quantity: pointQuantity,
              action: 1,
              user: {
                connect: { id: userId },
              },
              orderId: result.id,
              sum: point.quantity - pointQuantity,
              memo: '兑换商品',
            },
          }),
        ])
      } else {
        //如果是非积分兑换 body.pointQuantity为积分抵扣的积分值
        if (point && point.quantity < body.pointQuantity) {
          throw Error('积分不足')
        }
        let payStage = 1
        const residue = (price || sum) - body.pointQuantity // 剩余付款金额
        const deadline = dayjs().add(30, 'minute').unix()
        if (residue <= 0) {
          payStage = 3
        } else {
          await Promise.all([
            this.orderQueue.add(
              'dead',
              {
                orderNumber,
              },
              {
                delay: 60 * 30 * 1000,
              },
            ),
          ])
        }
        // 如果有积分兑换
        result = await prisma.order.create({
          data: {
            origin: 1,
            payStage,
            amount: sum,
            otherFees,
            completeAt: payStage === 3 ? now : 0,
            isPoint: 0,
            user: {
              connect: { id: userId },
            },
            deleteAt: 0,
            deleteReason: '',
            status: 1,
            orderNumber,
            deadline,
            orderSku: {
              createMany: { data: manyOrderSku },
            },
          },
          select: {
            id: true,
          },
        })
        if (payStage === 3) {
          await prisma.payment.create({
            data: {
              billType: 1,
              amount: body.pointQuantity,
              paymentMethod: 3,
              payStatus: 0,
              paymentAt: 0,
              orderId: result.id,
            },
          })
        }
        // if (body.pointQuantity > 0) {
        //   await Promise.all([
        //     prisma.point.update({
        //       where: { userId },
        //       data: {
        //         quantity: point.quantity - (residue + body.pointQuantity),
        //       },
        //     }),
        //     prisma.pointRecord.create({
        //       data: {
        //         quantity: residue + body.pointQuantity,
        //         action: 1,
        //         user: {
        //           connect: { id: userId },
        //         },
        //         orderId: result.id,
        //         sum: point.quantity - (residue + body.pointQuantity),
        //         memo: '抵扣商品',
        //       },
        //     }),
        //   ])
        // }
      }
      return result
    })
  }

  async used({ orderId, orderSkuIds, storeId }: UsedOrderDTO) {
    return this.prismaService.$transaction(async prisma => {
      const result = await prisma.order.findFirst({
        include: {
          orderSku: true,
        },
        where: { id: orderId, status: 1, payStage: 3 },
      })
      if (!result) {
        throw Error('订单不存在或已使用')
      }
      let errorSkuIds = orderSkuIds.filter(
        i =>
          !result.orderSku.find(
            j =>
              j.useStatus === 0 &&
              j.id === i &&
              j.status === 1 &&
              [0, storeId].includes(j.storeId),
          ),
      )
      if (errorSkuIds.length) {
        throw Error(`sku ${errorSkuIds.join('、')} 已使用或已删除`)
      }
      await prisma.orderSku.updateMany({
        where: { id: { in: orderSkuIds } },
        data: {
          usedAt: dayjs().unix(),
          useStatus: 1,
          storeId,
        },
      })
      const noUsedOrderSku = result.orderSku.filter(i => {
        return i.useStatus === 0 && !orderSkuIds.includes(i.id)
      })
      if (noUsedOrderSku.length === 0) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 2 },
        })
      }
      return orderId
    })
  }

  editOne(
    {
      skuOrders,
      ...data
    }: Prisma.orderUncheckedUpdateInput & {
      skuOrders?: Prisma.orderSkuCreateManyOrderInput[]
    },
    id: number,
  ) {
    return this.prismaService.order.update({
      data: {
        ...data,
        orderSku: {
          upsert: skuOrders.map(({ id = 0, ...i }) => ({
            update: i,
            where: { id },
            create: {
              ...i,
              createdAt: dayjs().unix(),
              updatedAt: dayjs().unix(),
              status: 1,
            },
          })),
        },
      },
      where: {
        id,
      },
    })
  }

  async deleteOne(id: number) {
    const result = await this.prismaService.order.findFirst({
      where: { id },
      select: { payStage: true, status: true },
    })
    if (result.payStage === 3) {
      throw Error('该订单已支付,无法取消')
    }
    return this.prismaService.order.update({
      where: { id },
      data: { status: 0, deleteAt: dayjs().unix() },
    })
  }
}
