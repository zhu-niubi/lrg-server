import { Injectable } from '@nestjs/common'
import { uniq } from 'lodash'
import { CouponService } from 'src/coupon/coupon.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class RecommendService {
  constructor(
    private couponService: CouponService,
    private prismaService: PrismaService,
  ) {}

  async getAll({
    pageNumber,
    pageSize,
    recommenderId,
  }: {
    pageSize?: number
    pageNumber?: number
    recommenderId?: number
  }) {
    const result = await this.prismaService.findAndCount({
      pageNumber,
      pageSize,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      where: {
        status: 1,
        recommenderId,
      },
      tableName: 'recommend',
    })
    const ids: any = result.list.reduce(
      (pre: any, next: any) => [...pre, next.userId, next.recommenderId],
      [],
    )
    const users = await this.prismaService.user.findMany({
      where: { id: { in: uniq(ids) } },
      select: { id: true, avatarUrl: true, name: true },
    })

    const userMap = users.reduce((p, n) => ({ [n.id]: n, ...p }), {})

    result.list.forEach((i: any) => {
      const user = userMap[i.userId]
      const recommender = userMap[i.recommenderId]
      i.userName = user?.name
      i.avatarUrl = user?.avatarUrl
      i.recommenderName = recommender?.name
      delete i.user
    })
    return result
  }

  getSuccessCount(recommenderId) {
    return this.prismaService.recommend.count({
      where: { recommenderId, usedCoupon: 1 },
    })
  }

  async addOne({
    recommenderId,
    userId,
    usedCoupon,
  }: {
    recommenderId: number
    userId: number
    usedCoupon: number
  }) {
    return this.prismaService.$transaction(async prisma => {
      // await this.couponService.addCoupon({
      //   userId,
      //   couponTemplateId: 19,
      //   memo: '推荐成功卡券',
      //   recommenderId,
      //   applyStore: [0],
      //   employeeId: null,
      // })
      return prisma.recommend.create({
        data: {
          recommenderId,
          userId,
          usedCoupon,
        },
      })
    })
  }

  editOne(
    {
      recommenderId,
      userId,
      usedCoupon,
    }: {
      recommenderId?: number
      userId?: number
      usedCoupon?: number
    },
    id: number,
  ) {
    return this.prismaService.recommend.update({
      where: { id },
      data: {
        recommenderId,
        userId,
        usedCoupon,
      },
    })
  }

  deleteOne(id: number) {
    return this.prismaService.recommend.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
