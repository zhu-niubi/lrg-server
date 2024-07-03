import { Injectable } from '@nestjs/common'
import { WxappService } from 'src/wxapp/wxapp.service'
import dayjs from 'dayjs'
import { exclude } from 'src/lib/util'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateConstructionDTO } from './dto/create-construction.dto'
import { GetConstructionDTO } from './dto/get-construction.dto'
import { UpdateConstructionDTO } from './dto/update-construction.dto'
import { uniq } from 'lodash'
import { phoneCheck } from 'src/lib/testing'

@Injectable()
export class ConstructionService {
  constructor(
    private wxAppService: WxappService,
    private prismaService: PrismaService,
  ) {}
  async getAll({
    carId,
    pageNumber,
    pageSize,
    userId,
    phoneNumber,
    productId,
    carNumber,
    id,
    userCarId,
    status,
    code,
    storeId,
    orderNumber,
    rollId,
  }: GetConstructionDTO) {
    const result = await this.prismaService.table('construction')({
      pageNumber,
      pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        settlement_order: {
          select: { id: true },
        },
        constructionSku: {
          select: {
            productSku: {
              select: {
                product: {
                  select: { name: true },
                },
              },
            },
          },
        },
        userCar: {
          select: {
            carNumber: true,
            carId: true,
            user: {
              select: {
                name: true,
                phoneNumber: true,
              },
            },
            car: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
      where: {
        status: status || { not: 0 },
        id,
        storeId,
        code,
        orderNumber,
        constructionSku: productId && {
          some: {
            rollId,
            roll: {
              product: {
                id: productId,
              },
            },
          },
        },
        userCar: {
          carNumber,
          userId,
          id: userCarId,
          car: {
            id: carId,
          },
          user: {
            phoneNumber,
            id: userId,
          },
        },
      },
    })
    result.list.forEach((i: any) => {
      i.userName = i?.userCar?.user?.name
      i.phoneNumber = i?.userCar?.user?.phoneNumber
      i.carName = i?.userCar?.car?.name
      i.settlementId = i?.settlement_order?.id || 0
      i.phoneNumber = phoneCheck('+86', i.phoneNumber)
        ? i.phoneNumber.slice(0, 3) + '****' + i.phoneNumber.slice(-4)
        : i.phoneNumber
      i.productName = uniq(
        i.constructionSku?.map(j => j.productSku?.product?.name),
      ).filter(i => !!i)
      i.carId = i?.userCar?.car?.id
      i.carNumber = i?.userCar?.carNumber
      delete i.userCar
      delete i.constructionSku
      delete i.settlement_order
    })
    return result
  }

  async findOne({
    id,
    userCarId,
    storeId,
    userId,
    code,
  }: {
    id?: number
    rollId?: number
    productId?: number
    storeId?: number
    userId?: number
    userCarId?: number
    code?: string
  }) {
    const result = await this.prismaService.construction.findFirst({
      include: {
        settlement_order: {
          select: {
            id: true,
            price: true,
            otherPrice: true,
            paymentMethod: true,
          },
        },
        constructionSku: {
          where: { status: 1 },
          select: {
            id: true,
            length: true,
            productSkuId: true,
            roll: {
              select: {
                id: true,
                official: true,
                rollNumber: true,
              },
            },
            productSku: {
              select: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    productModel: {
                      select: {
                        name: true,
                        id: true,
                        productType: {
                          select: { name: true, id: true },
                        },
                      },
                    },
                  },
                },
                name: true,
              },
            },
            employee: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        store: {
          select: {
            name: true,
          },
        },
        userCar: {
          select: {
            userId: true,
            carNumber: true,
            carId: true,
            VIN: true,
            car: {
              select: {
                id: true,
                name: true,
                carBrand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            user: {
              select: {
                name: true,
                phoneNumber: true,
              },
            },
          },
        },
        constructionImage: {
          select: {
            id: true,
            src: true,
            productId: true,
            constructionId: true,
          },
        },
        warranty: {
          select: {
            deadline: true,
            code: true,
          },
        },
      },
      where: {
        status: { not: 0 },
        userCar: {
          user: { id: userId },
          id: userCarId,
        },
        id,
        code,
        storeId,
      },
    })
    if (!result) {
      throw new Error('找不到此施工单')
    }
    return exclude(
      {
        ...result,
        constructionSku: result.constructionSku?.map(j => ({
          id: j.id,
          productName: j.productSku?.product?.name,
          productId: j?.productSku?.product?.id,
          rollNumber: j?.roll?.rollNumber,
          rollId: j.roll?.id,
          official: j.roll?.official,
          productSkuId: j.productSkuId,
          productSkuName: j.productSku?.name,
          length: j.length / 10,
          employeeName: j.employee?.name,
          employeeId: j.employee?.id,
          productModelName: j?.productSku?.product?.productModel?.name,
          productModelId: j?.productSku?.product?.productModel?.id,
          productTypeId: j?.productSku?.product?.productModel?.productType?.id,
          productTypeName:
            j?.productSku?.product?.productModel?.productType?.name,
        })),
        deadline: result.warranty?.deadline,
        warrantyCode: result.warranty?.code,
        userName: result.userCar.user.name,
        phoneNumber: result.userCar.user.phoneNumber,
        carName: result.userCar.car.name,
        carId: result.userCar.car.id,
        carNumber: result.userCar.carNumber,
        VIN: result.userCar.VIN,
        carBrandName: result.userCar.car.carBrand.name,
        storeName: result?.store?.name,
        settlement: result.settlement_order || null,
      },
      'userCar',
      'store',
      'warranty',
      'settlement_order',
    )
  }

  addOne({
    userCarId,
    kilometer,
    defectImages,
    defectPart,
    defectType,
    expectComplete,
    storeId,
    memo = '',
    constructionSku,
    orderNumber = '',
  }: CreateConstructionDTO) {
    return this.prismaService.construction.create({
      data: {
        kilometer,
        defectImages,
        defectPart,
        defectType,
        expectComplete,
        completeAt: 0,
        orderNumber,
        checkSign: '',
        checkSignAgain: '',
        code:
          `N${userCarId}` +
          Math.random()
            .toString(36)
            .substring(2, 12 - userCarId.toString().length) +
          dayjs().unix().toString().substring(4, 10),
        userCarId,
        storeId,
        memo,
        constructionSku: {
          createMany: {
            data: constructionSku?.map(i => ({
              productSkuId: i.productSkuId,
              employeeId: i.employeeId || 0,
              rollId: i.rollId || 0,
              length: i.length || 0,
              createdAt: dayjs().unix(),
              updatedAt: dayjs().unix(),
            })),
          },
        },
      },
    })
  }

  editOne(
    {
      userCarId,
      kilometer,
      defectImages,
      defectPart,
      defectType,
      expectComplete,
      storeId,
      memo,
      constructionSku = [],
      orderNumber,
      checkSign,
      checkSignAgain,
      status,
    }: UpdateConstructionDTO,
    { id, storeId: whereStore }: { id?: number; storeId?: number },
  ) {
    return this.prismaService.$transaction(async prisma => {
      const constructionRecord = await prisma.construction.findFirst({
        select: {
          status: true,
          code: true,
          userCar: { select: { userId: true, id: true } },
        },
        where: {
          id,
          storeId: whereStore,
        },
      })
      if (!constructionRecord) {
        throw new Error('找不到该施工单信息')
      }
      if (status && constructionRecord.status !== status - 1) {
        throw new Error('施工单状态不正确')
      }
      let completeAt
      if (constructionRecord.status === 4 && status === 5) {
        //施工完成
        completeAt = dayjs().unix()
        const user = await prisma.user.findFirst({
          where: { id: constructionRecord.userCar.userId },
          select: { openId: true },
        })
        this.sendMessageForCouponWillDeadline({
          ...user,
          code: constructionRecord.code,
          completedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          page: `/pages/admin/subPages/constructionDetail/constructionDetail?id=${id}`,
        })
      }
      const constructionResult = await prisma.construction.update({
        data: {
          userCarId,
          kilometer,
          defectImages,
          defectPart,
          defectType,
          expectComplete,
          storeId,
          completeAt,
          orderNumber,
          checkSign,
          checkSignAgain,
          memo,
          status,
          constructionSku: {
            upsert: constructionSku?.map(({ id = 0, ...i }) => ({
              where: {
                id,
              },
              create: {
                ...i,
                createdAt: dayjs().unix(),
                updatedAt: dayjs().unix(),
                status: 1,
              },
              update: {
                ...i,
                updatedAt: dayjs().unix(),
              },
            })),
          },
        },
        where: { id },
      })
      if (status === 7) {
        await prisma.warranty.create({
          data: {
            deadline: dayjs().add(10, 'year').unix(),
            constructionId: id,
            code: `W${constructionRecord.userCar.id}${Math.random()
              .toString(36)
              .substring(
                2,
                12 - constructionRecord.userCar.id.toString().length,
              )}${dayjs().unix().toString().substring(5, 10)}`,
          },
        })
      }

      return constructionResult
    })
  }

  // async confirm({
  //   storeId,
  //   constructionId,
  //   userId,
  //   status,
  //   image,
  // }: {
  //   storeId?: number
  //   constructionId: number
  //   status?: number
  //   userId?: number
  //   image?: string
  // }) {
  //   return this.prismaService.$transaction(async prisma => {
  //     const constructionRecord = await prisma.construction.findFirst({
  //       select: { status: true },
  //       where: {
  //         id: constructionId,
  //         userCar: {
  //           userId,
  //         },
  //         storeId,
  //       },
  //     })
  //     if (!constructionRecord) {
  //       throw new Error('找不到该施工单信息')
  //     }
  //     if (status && constructionRecord.status !== status - 1) {
  //       throw new Error('施工单状态不正确')
  //     }
  //     if (status === 5) {
  //       //施工完成
  //       const user = await prisma.user.findFirst({
  //         where: { id: userId },
  //         select: { openId: true },
  //       })
  //       this.sendMessageForCouponWillDeadline({
  //         ...user,
  //         id: constructionId.toString(),
  //         completedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  //         page: `/pages/admin/subPages/constructionDetail/constructionDetail?id=${constructionId}`,
  //       })
  //     }
  //     const result = await prisma.construction.update({
  //       where: { id: constructionId },
  //       data: {
  //         status,
  //         checkSign: status === 2 && image,
  //         completeAt: status === 5 && dayjs().unix(),
  //         checkSignAgain: status === 6 && image,
  //       },
  //     })
  //     return result
  //   })
  // }

  // async start(
  //   //开始施工
  //   {
  //     constructionId,
  //     productPositions,
  //     rollId,
  //     length,
  //   }: {
  //     constructionId: number
  //     productPositions: { id: number; employeeId: number }[]
  //     rollId?: number
  //     length?: number
  //   },
  //   storeId?: number,
  // ) {
  //   return this.prismaService.$transaction(async prisma => {
  //     const constructionRecord = await prisma.construction.findFirst({
  //       select: { status: true },
  //       where: {
  //         id: constructionId,
  //         storeId,
  //       },
  //     })
  //     if (!constructionRecord) {
  //       throw new Error('施工单不存在')
  //     }
  //     if (constructionRecord.status !== 3) {
  //       throw new Error('施工单状态不正确')
  //     }
  //     return prisma.construction.update({
  //       data: {
  //         status: 4,
  //         constructionSku: {
  //           updateMany: productPositions.map(i => ({
  //             where: { id: i.id },
  //             data: { employeeId: i.employeeId, rollId, length },
  //           })),
  //         },
  //       },
  //       where: { id: constructionId },
  //     })
  //   })
  // }

  async back({
    storeId,
    constructionId,
    status,
  }: {
    storeId?: number
    constructionId: number
    status: number
  }) {
    return this.prismaService.$transaction(async prisma => {
      const constructionRecord = await prisma.construction.findFirst({
        select: { status: true },
        where: {
          id: constructionId,
          storeId,
        },
      })
      if (!constructionRecord) {
        throw new Error('找不到该施工单信息')
      }
      if (status === 7) {
        throw Error('该施工单已完成，无法撤回')
      }
      if (status && constructionRecord.status !== status + 1) {
        throw new Error('施工单状态不正确')
      }
      return prisma.construction.update({
        where: { id: constructionId },
        data: { status },
      })
    })
  }

  async deleteOne(id: number, storeId?: number) {
    if (storeId) {
      const result = await this.prismaService.construction.findFirst({
        where: { storeId, id },
      })
      if (!result) {
        throw Error('找不到此条记录')
      }
    }
    return this.prismaService.construction.update({
      data: {
        status: 0,
        constructionSku: {
          updateMany: {
            data: { status: 0 },
            where: {},
          },
        },
      },
      where: { id },
    })
  }

  sendMessageForCouponWillDeadline({
    openId,
    code,
    completedAt,
    page,
  }: {
    openId: string
    code: string
    completedAt: string
    page: string
  }) {
    this.wxAppService.sendMessage({
      page,
      template_id: 'tP7rhr3kWhKbE8O9JzXC0YR1u62aUuJz4NnLwJ38sUw',
      touser: openId,
      data: {
        character_string1: {
          value: code,
        },
        thing2: {
          value: '施工单',
        },
        time3: {
          value: completedAt,
        },
        thing4: {
          value: '您的施工单已完成，请及时前往门店确认提车',
        },
      },
    })
  }
}
