import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { CreateConstructionImageDto } from './dto/create-construction-image.dto'
import { UpdateConstructionImageDto } from './dto/update-construction-image.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetConstructionImageDto } from './dto/get-construction-image.dto'
import dayjs from 'dayjs'
import { WxappService } from 'src/wxapp/wxapp.service'
import { Cache } from 'cache-manager'
@Injectable()
export class ConstructionImageService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
    private wxappService: WxappService,
  ) {}
  async create(createConstructionImageDto: CreateConstructionImageDto) {
    const user = await this.prismaService.construction.findFirst({
      where: { id: createConstructionImageDto.constructionId },
      select: {
        userCar: {
          select: { carId: true, user: { select: { id: true, openId: true } } },
        },
      },
    })
    await this.wxappService.sendMessage({
      page: '/',
      touser: user.userCar.user.openId,
      data: {
        time2: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        thing3: '您的施工单有新的进度变化！！',
        thing4: '点击进入小程序看看吧',
      },
      template_id: 'aOyBHMOQiEaUQ0o9-yBDt5TY-C_FI8JRxqFglwsu3Iw',
    })
    return this.prismaService.constructionImage.create({
      data: {
        ...createConstructionImageDto,
        carId: user.userCar.carId,
      },
    })
  }

  async findAll(getConstructionImageDto: GetConstructionImageDto) {
    const result = await this.prismaService.table('constructionImage')({
      pageNumber: getConstructionImageDto.pageNumber,
      pageSize: getConstructionImageDto.pageSize,
      include: {
        product: {
          select: {
            name: true,
            productModel: {
              select: {
                productType: {
                  select: {
                    name: true,
                  },
                },
                name: true,
              },
            },
          },
        },
        construction: {
          select: {
            store: {
              select: {
                name: true,
              },
            },
          },
        },
        car: {
          select: {
            name: true,
            carBrand: {
              select: { name: true },
            },
          },
        },
      },
      where: {
        status: 1,
        constructionId: getConstructionImageDto.constructionId,
        product: {
          id: getConstructionImageDto.productId,
          productModel: {
            id: getConstructionImageDto.productModelId,
            productTypeId: getConstructionImageDto.productTypeId,
          },
        },
        car: {
          carBrandId: getConstructionImageDto.carBrandId,
        },
        createdAt: {
          lte: getConstructionImageDto.endTime,
          gte: getConstructionImageDto.startTime,
        },
      },
    })
    result.list.forEach((i: any) => {
      i.productName = i.product.name
      i.storeName = i.construction?.store?.name
      i.carName = i.car?.name
      i.carBrandName = i.car?.carBrand?.name
      i.productModelName = i.product.productModel.name
      i.productTypeName = i.product.productModel.productType.name
      delete i.product
      delete i.car
      delete i.construction
    })
    return result
  }

  async setHomeImgaes(images: number[]) {
    try {
      const a = await this.cacheManager.set(
        'homeImages',
        JSON.stringify(images),
        { ttl: 0 },
      )
    } catch (err) {
      console.log(err)
    }
  }

  async findHomeImages() {
    const ids: string | undefined = await this.cacheManager.get('homeImages')
    if (!ids) {
      return []
    }
    return ids
  }

  findOne(id: number) {
    return `This action returns a #${id} constructionImage`
  }

  update(id: number, updateConstructionImageDto: UpdateConstructionImageDto) {
    return this.prismaService.constructionImage.update({
      data: updateConstructionImageDto,
      where: { id },
    })
  }

  remove(id: number) {
    return this.prismaService.constructionImage.update({
      data: {
        deletedAt: dayjs().unix(),
        status: 0,
      },
      where: { id },
    })
  }
}
