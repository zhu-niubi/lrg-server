import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCouponTemplateDTO } from './dto/create-couponTemplate.dto'
import { GetCouponTemplateDTO } from './dto/get-couponTemplate.dto'
import { UpdateCouponTemplateDTO } from './dto/update-couponTemplate.dto'

@Injectable()
export class CouponTemplateService {
  constructor(private prismaService: PrismaService) {}
  async getAll({
    pageNumber,
    pageSize,
    name,
    startTime,
    endTime,
    productId,
  }: GetCouponTemplateDTO) {
    const result = await this.prismaService.table('couponTemplate')({
      pageNumber,
      pageSize,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        product: {
          select: { name: true },
        },
        productSku: {
          select: { name: true },
        },
      },
      where: {
        name: {
          contains: name,
        },
        productId,
        status: { not: 0 },
        createdAt: {
          gte: startTime,
          lte: endTime,
        },
      },
    })
    result &&
      result.list.forEach((i: any) => {
        i.productName = i.product.name
        i.productSkuName = i.productSku.name
        delete i.product
        delete i.productSku
      })
    return result
  }

  addCouponTemplate(createCouponTemplateDTO: CreateCouponTemplateDTO) {
    return this.prismaService.couponTemplate.create({
      data: {
        ...createCouponTemplateDTO,
        amount: createCouponTemplateDTO.amount || 0,
      },
    })
  }

  editCouponTemplate(
    {
      name,
      amount,
      deadline,
      image,
      deadlineDay,
      productId,
      memo,
    }: UpdateCouponTemplateDTO,
    id: number,
  ) {
    return this.prismaService.couponTemplate.update({
      where: { id },
      data: {
        name,
        productId,
        amount,
        image,
        deadline,
        deadlineDay,
        memo,
      },
    })
  }

  delCouponTemplate(id: number) {
    return this.prismaService.couponTemplate.update({
      where: { id },
      data: { status: 0 },
    })
  }
  async getCouponClass(userId: number) {
    const result = await this.prismaService.couponTemplate.findMany({
      select: {
        id: true,
        userCoupon: {
          select: {
            id: true,
          },
        },
        product: {
          select: {
            homePicture: true,
            name: true,
            id: true,
          },
        },
      },
      where: {
        userCoupon: {
          some: {
            userId,
            status: 1,
            deadline: {
              gte: dayjs().unix(),
            },
          },
        },
        status: 1,
      },
    })
    return result?.map(i => ({ ...i.product }))
  }
}
