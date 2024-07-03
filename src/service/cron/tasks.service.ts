import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { WxappService } from 'src/wxapp/wxapp.service'
import dayjs from 'dayjs'
import { uniq } from 'lodash'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class TasksService {
  constructor(
    private wxAppService: WxappService,
    private prismaService: PrismaService,
  ) {}

  @Cron('0 0 10 */1 * *')
  async handleCron() {
    const result: {
      coupons: {
        couponTemplateId: number
        deadline: number
      }[]
      userId: number
    }[] = await this.prismaService
      .$queryRaw`select JSON_ARRAYAGG(JSON_OBJECT('couponTemplateId',couponTemplateId,'deadline',deadline)) id,userId FROM coupon where deadline BETWEEN ${dayjs().unix()} and ${dayjs()
      .add(1, 'day')
      .unix()} and status = 1 group by userId`
    const [aCouponTemplateId, userId] = result.reduce(
      (prev, next) => {
        prev[0].push(next.coupons.map(i => i.couponTemplateId))
        prev[1].push(next.userId)
        return prev
      },
      [[], []],
    )
    const couponTemplateRecords =
      await this.prismaService.couponTemplate.findMany({
        select: { name: true, id: true, productId: true },
        where: {
          id: { in: uniq(aCouponTemplateId.flat()) },
          status: 1,
        },
      })
    const users = await this.prismaService.user.findMany({
      where: { id: { in: userId } },
      select: { id: true, openId: true },
    })
    for (let i of result) {
      const userCouponTemplateRecords = couponTemplateRecords.filter(j =>
        i.coupons.find(k => k.couponTemplateId === j.id),
      )
      const userRecord = users.find(j => j.id === i.userId)
      if (userCouponTemplateRecords.length === 1) {
        this.sendMessageForCouponWillDeadline({
          openId: userRecord.openId,
          deadline: dayjs(i.coupons[0].deadline * 1000).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          name: userCouponTemplateRecords[0].name,
          memo: '您的卡券即将过期，请尽快使用',
          page: `/pages/admin/cardCoupon/cardCoupon?cardId=${userCouponTemplateRecords[0].productId}`,
        })
      }
      if (userCouponTemplateRecords.length > 1) {
        let name = ''
        if (userCouponTemplateRecords.length > 3) {
          name = `${userCouponTemplateRecords
            .slice(0, 3)
            .map(i => i.name)
            .join('、')}，${i.coupons.length}张卡券`
        } else {
          name = `${userCouponTemplateRecords.map(i => i.name).join('、')}，${
            i.coupons.length
          }张卡券`
        }
        i.coupons.sort((a, b) => a.deadline - b.deadline)
        this.sendMessageForCouponWillDeadline({
          page: `/pages/admin/cardCoupon/cardCoupon?cardId=${userCouponTemplateRecords[0].productId}`,
          openId: userRecord.openId,
          deadline: `${dayjs(i.coupons[0].deadline * 1000).format(
            'YYYY-MM-DD',
          )}~${dayjs(i.coupons[i.coupons.length - 1].deadline * 1000).format(
            'YYYY-MM-DD',
          )}`,
          name,
          memo: '您的卡券即将过期，请尽快使用',
        })
      }
    }
  }

  sendMessageForCouponWillDeadline({
    openId,
    name,
    deadline,
    memo,
    page,
  }: {
    openId: string
    name: string
    deadline: string
    memo: string
    page: string
  }) {
    this.wxAppService.sendMessage({
      page,
      template_id: 'yekvnJmuFKHB4SD1icxJiw1fYCGJ3hzMb6xZRhcEX6I',
      touser: openId,
      data: {
        thing1: {
          value: name,
        },
        thing2: {
          value: '卡券',
        },
        time3: {
          value: deadline,
        },
        thing4: {
          value: memo,
        },
      },
    })
  }
}
