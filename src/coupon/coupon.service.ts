import { Injectable } from '@nestjs/common'
import { WxappService } from 'src/wxapp/wxapp.service'
import dayjs from 'dayjs'
import { BuildCode } from 'src/lib/util'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateCouponDTO } from './dto/update-coupon.dto'
import { GetCouponVo } from './dto/get-coupon.dto'
@Injectable()
export class CouponService {
  constructor(
    private wxAppService: WxappService,
    private prismaService: PrismaService,
  ) {}

  async getAll({
    pageNumber,
    pageSize,
    userId,
    couponTemplateId,
    phoneNumber,
    startTime,
    endTime,
    code,
    status,
    productId,
    storeId,
  }: GetCouponVo) {
    const result = await this.prismaService.table('userCoupon')({
      pageNumber,
      pageSize,
      orderBy: { id: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        store: {
          select: { name: true },
        },
        userProductPack: {
          select: {
            productPack: {
              select: {
                pictrue: true,
                name: true,
              },
            },
          },
        },
        product: {
          select: { name: true },
        },
        couponTemplate: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      where: {
        productId,
        couponTemplateId,
        code,
        user: {
          id: userId,
          phoneNumber,
        },
        createdAt: {
          gte: startTime,
          lte: endTime,
        },
        ...(storeId
          ? {
              OR: [
                {
                  applyStore: {
                    array_contains: [storeId],
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
        deadline: {
          gte: status === 1 ? dayjs().unix() : undefined,
          lte: status === 3 ? dayjs().unix() : undefined,
        },
        status: status === 3 ? 1 : status,
      },
    })
    result &&
      result.list.forEach((i: any) => {
        i.userName = i.user.name
        i.couponTemplateName =
          i.couponTemplate?.name || i.userProductPack?.productPack?.name
        i.couponTemplateImage =
          i.couponTemplate?.image || i.userProductPack?.productPack?.pictrue
        i.couponTemplatePicture = i.couponTemplate?.picture
        i.storeName = i.store?.name
        i.productName = i.product?.name
        delete i.user
        delete i.couponTemplate
        delete i?.store
        delete i?.product
        delete i?.userProductPack
      })
    return result
  }

  async getOne({ code }: { code?: string }) {
    const result = await this.prismaService.userCoupon.findFirst({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        userProductPack: {
          select: {
            productPack: {
              select: {
                pictrue: true,
                name: true,
              },
            },
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        couponTemplate: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      where: {
        code,
        status: {
          not: 0,
        },
        deadline: {
          gte: dayjs().unix(),
        },
      },
    })
    if (!result) return
    const applyStore = result.applyStore as number[]
    const store = await this.prismaService.store.findMany({
      select: { name: true, id: true },
      where: { id: { in: applyStore } },
    })
    const resultJson = {
      userName: result.user.name,
      couponTemplateName:
        result.couponTemplate?.name ||
        result.userProductPack?.productPack?.pictrue,
      productName: result.product.name,
      couponTemplateImage:
        result.couponTemplate?.image ||
        result.userProductPack?.productPack?.name,
      applyStore: applyStore.includes(0)
        ? applyStore
        : applyStore.map(i => store.find(j => j.id === i)),
    }
    delete result.user
    delete result.product
    delete result.couponTemplate
    return { ...result, ...resultJson }
  }

  addCoupon({
    userId,
    couponTemplateId,
    memo,
    orderNumber = '',
    recommenderId = 0,
    applyStore = [],
    employeeId,
  }: {
    userId: number
    couponTemplateId: number
    memo: string
    orderNumber?: string
    recommenderId?: number
    applyStore?: number[]
    employeeId: number
  }) {
    return this.prismaService.$transaction(async prisma => {
      const couponTemplateRecord = await prisma.couponTemplate.findFirst({
        where: { id: couponTemplateId },
      })
      const userRecord = await prisma.user.findFirst({
        where: { id: userId },
        select: { openId: true },
      })
      if (!userRecord) {
        throw new Error('用户不存在')
      }
      if (!couponTemplateRecord) {
        throw new Error('优惠券模版信息有误')
      }
      const deadline =
        couponTemplateRecord.deadline ||
        dayjs().add(couponTemplateRecord.deadlineDay, 'day').unix()
      const result = await this.prismaService.userCoupon.create({
        data: {
          userId,
          couponTemplateId,
          memo,
          deadline,
          usedAt: 0,
          storeId: 0,
          code: BuildCode(),
          orderNumber,
          recommenderId,
          productId: couponTemplateRecord.productId,
          productSkuId: couponTemplateRecord.productSkuId,
          source: 1,
          userProductPackId: 0,
          applyStore,
          employeeId,
        },
      })

      this.sendCouponForMessage({
        page: `/pages/admin/cardCoupon/cardCoupon?cardId=${couponTemplateRecord.productId}`,
        couponTemplateName: couponTemplateRecord.name,
        deadline,
        openId: userRecord.openId,
        memo: couponTemplateRecord.memo,
      })
      return result
    })
  }

  async addMany({
    userId,
    count,
    couponTemplateId,
    memo,
    applyStore = [],
    employeeId,
  }: {
    userId: number[]
    count: number
    couponTemplateId: number
    memo?: string
    applyStore?: number[]
    employeeId: number
  }) {
    const successResult: number[] = []
    const failResult: { userId: number; reason: string }[] = []
    for (let id of userId) {
      if (count !== 0) {
        const manyCoupon = new Array(count).fill({
          userId: id,
          couponTemplateId,
          memo,
          orderNumber: '',
          applyStore,
          employeeId,
        })
        await this.addManyCoupon(manyCoupon, { userId: id, count })
          .then(() => successResult.push(id))
          .catch(err => failResult.push({ userId: id, reason: err.message }))
      } else {
        await this.addCoupon({
          userId: id,
          couponTemplateId,
          memo,
          employeeId,
        })
          .then(() => successResult.push(id))
          .catch(err => failResult.push({ userId: id, reason: err.message }))
      }
    }
    return { successResult, failResult }
  }

  addManyCoupon(
    manyCoupon: {
      userId: number
      couponTemplateId: number
      memo: string
      orderNumber: string
      deadline?: number
      applyStore: number[]
      employeeId: number
    }[],
    params: { userId: number; count: number },
  ) {
    return this.prismaService.$transaction(async prisma => {
      const couponTemplateRecord = await prisma.couponTemplate.findFirst({
        where: { id: manyCoupon[0].couponTemplateId },
      })
      const user = await prisma.user.findFirst({
        where: { id: params.userId },
        select: { openId: true },
      })
      if (!couponTemplateRecord) {
        throw new Error('优惠券模版信息有误')
      }
      if (!user) {
        throw new Error('该用户不存在')
      }

      const deadline =
        couponTemplateRecord.deadline ||
        dayjs().add(couponTemplateRecord.deadlineDay, 'day').unix()

      if (deadline <= dayjs().unix()) {
        throw Error('该卡券设置的过期时间大于当前时间，请检查后重试')
      }

      await this.sendCouponForMessage({
        page: `/pages/admin/cardCoupon/cardCoupon?cardId=${couponTemplateRecord.productId}`,
        couponTemplateName: `${couponTemplateRecord.name} * ${params.count}`,
        openId: user.openId,
        deadline,
        memo: manyCoupon[0].memo,
      })

      return this.prismaService.userCoupon.createMany({
        data: manyCoupon.map(i => ({
          deadline,
          storeId: 0,
          code: BuildCode(),
          usedAt: 0,
          productId: couponTemplateRecord.productId,
          productSkuId: couponTemplateRecord.productSkuId,
          source: 1,
          userProductPackId: 0,
          ...i,
        })),
      })
    })
  }

  async sendCouponForMessage({
    couponTemplateName,
    deadline,
    openId,
    memo,
    page,
  }: {
    couponTemplateName: string
    deadline: number
    openId: string
    page: string
    memo?: string
  }) {
    return this.wxAppService.sendMessage({
      page,
      template_id: 'Yqf5NbM1teijfyCkEUJHJ2ASGK8FVw5-YA9toGell5U',
      data: {
        thing1: {
          value: 'NKD纳管家',
        },
        thing2: {
          value: couponTemplateName,
        },
        time3: {
          value: `${dayjs().format('YYYY-MM-DD')}~${dayjs(
            deadline * 1000,
          ).format('YYYY-MM-DD')}`,
        },
        thing4: {
          value: memo || '无',
        },
      },
      touser: openId,
    })
  }

  editCoupon(
    {
      userId,
      couponTemplateId,
      memo,
      orderNumber,
      deadline,
      applyStore,
    }: UpdateCouponDTO,
    id: number,
  ) {
    return this.prismaService.userCoupon.update({
      where: { id },
      data: {
        userId,
        couponTemplateId,
        orderNumber,
        deadline,
        memo,
        applyStore,
      },
    })
  }

  async useCoupon(code: string, storeId: number) {
    return this.prismaService.$transaction(async prisma => {
      const record = await prisma.userCoupon.findFirst({
        select: {
          status: true,
          id: true,
          recommenderId: true,
          userId: true,
          applyStore: true,
          productId: true,
          productSkuId: true,
        },
        where: { code, status: 1 },
      })
      if (!record) throw Error('找不到此卡券')
      if (
        (record?.applyStore as number[])?.includes(storeId) ||
        ((record?.applyStore as number[])?.includes(0) && record) //0为全部
      ) {
        const now = dayjs().unix()
        return prisma.userCoupon.update({
          where: { id: record.id },
          data: { status: 2, usedAt: now, storeId },
        })
      }
      throw Error('找不到此卡券/门店不适用')
    })
  }

  delCoupon(id: number, orderNumber?: string) {
    return this.prismaService.userCoupon.updateMany({
      where: { id, orderNumber },
      data: { status: 0 },
    })
  }
}
