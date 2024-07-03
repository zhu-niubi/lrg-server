import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import { miniPrepay, sha256WithRsa } from '@lib/wx-pay'
import { PrismaService } from 'src/prisma/prisma.service'
import dayjs from 'dayjs'
import { Cache } from 'cache-manager'
import { PaidPaymentDto } from './dto/paid-payment.dto'
@Injectable()
export class PaymentService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    const orderResult = await this.prismaService.order.findFirst({
      where: { orderNumber: createPaymentDto.orderNumber },
      include: {
        user: { select: { openId: true } },
        orderSku: true,
      },
    })
    if (!orderResult && orderResult.orderSku.length) {
      throw Error('找不到该订单号')
    }
    const cache = await this.cacheManager.get(createPaymentDto.orderNumber)
    if (cache) {
      return JSON.parse(cache as string)
    }
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
            id: { in: orderResult.orderSku.map(i => i.productSkuId) },
          },
        },
      },
      where: {
        productSku: {
          some: {
            id: { in: orderResult.orderSku.map(i => i.productSkuId) },
          },
        },
      },
    })
    const description = resultProduct
      .map(p => {
        return p.name
      })
      .join('、')
    await this.prismaService.payment.create({
      data: {
        billType: 1,
        amount: orderResult.amount,
        paymentMethod: 3,
        payStatus: 1,
        paymentAt: 0,
        orderId: orderResult.id,
      },
    })
    const payid = await miniPrepay({
      description,
      order: createPaymentDto.orderNumber,
      amount: orderResult.amount,
      openid: orderResult.user.openId,
      time_expire: dayjs(orderResult.deadline).toDate(),
    })
    if (payid.message) {
      throw Error(payid.message)
    }
    let json: any = {
      appId: process.env.wxAppId,
      timeStamp: dayjs().unix(),
      nonceStr: Math.random().toString(36).substring(2, 16),
      package: `prepay_id=${payid.prepay_id}`,
    }
    json.paySign = sha256WithRsa(Object.values(json).join('\n') + '\n')
    this.cacheManager.set(createPaymentDto.orderNumber, JSON.stringify(json), {
      ttl: 60 * 30,
    })
    return json
  }

  async paid({ orderNumber }: { orderNumber: string }) {
    const now = dayjs().unix()
    await this.prismaService.$transaction(async prisma => {
      const order = await prisma.order.update({
        data: {
          payStage: 3,
          completeAt: now,
        },
        where: { orderNumber },
      })
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: {
          paymentAt: now,
          payStatus: 1,
        },
      })
      await prisma.orderSku.updateMany({
        where: {
          orderId: order.id,
        },
        data: {
          completeAt: now,
        },
      })
      return order
    })
  }

  findAll() {
    return `This action returns all payment`
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`
  }

  remove(id: number) {
    return `This action removes a #${id} payment`
  }
}
