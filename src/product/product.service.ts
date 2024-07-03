import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProductDTO } from './dto/create-product.dto'
import { UpdateProductDTO } from './dto/update-product.dto'
import { GetProductDTO } from './dto/get-product.dto'

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  async getAll({
    pageNumber,
    pageSize,
    name,
    productTypeId,
    productModelId,
    productModelName,
    type,
    storeId,
    saleStatus,
    pointStatus,
  }: GetProductDTO) {
    return this.prismaService
      .table('product')({
        pageNumber,
        pageSize,
        include: {
          productModel: {
            select: {
              name: true,
            },
          },
        },
        where: {
          name: { contains: name },
          type,
          productSku: pointStatus
            ? {
                some: {
                  pointStatus,
                },
              }
            : undefined,
          status: {
            not: 0,
          },
          productModelId,
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
          saleStatus,
          productModel:
            productTypeId || productModelName
              ? {
                  name: { contains: productModelName },
                  productType: {
                    id: productTypeId,
                  },
                }
              : undefined,
        },
      })
      .then(result => {
        result.list.forEach((i: any) => {
          i.productModelName = i?.productModel?.name
          delete i.productModel
        })
        return result
      })
  }

  async getOne({ productId }: { productId?: number }) {
    const result = await this.prismaService.product.findFirst({
      include: {
        productSku: {
          select: {
            id: true,
            price: true,
            name: true,
            pointStatus: true,
            point: true,
            status: true,
          },
          where: {
            status: 1,
          },
        },
        productModel: {
          select: {
            id: true,
            name: true,
            productType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        status: {
          not: 0,
        },
        id: productId,
      },
    })
    return {
      ...result,
      productModelName: result.productModel?.name,
      productModel: undefined,
      productTypeName: result.productModel?.productType?.name,
      productTypeId: result.productModel?.productType?.id,
      productType: undefined,
    }
  }

  async getUserProduct({
    userId,
    productId,
  }: {
    userId: number
    productId: number
  }) {
    const result = await this.getOne({ productId })
    const orderRecord = await this.prismaService.order.findFirst({
      where: {
        // productId: result.id,
        userId,
        status: 1,
      },
    })
    return {
      ...result,
      orderNumber: orderRecord?.orderNumber,
      status: orderRecord?.status,
    }
  }

  addOne({ skus, ...createProductDTO }: CreateProductDTO) {
    return this.prismaService.product.create({
      select: {
        id: true,
      },
      data: {
        ...createProductDTO,
        productSku: {
          createMany: {
            data: skus.map(i => ({
              ...i,
              stock: 1,
              createdAt: dayjs().unix(),
              updatedAt: dayjs().unix(),
            })),
          },
        },
      },
    })
  }

  editOne({ skus, ...updateProductDTO }: UpdateProductDTO, id: number) {
    return this.prismaService.product.update({
      select: {
        id: true,
      },
      data: {
        ...updateProductDTO,
        productSku: {
          upsert: skus.map(({ id = 0, ...i }) => {
            return {
              where: { id },
              create: {
                ...i,
                stock: 1,
                createdAt: dayjs().unix(),
                updatedAt: dayjs().unix(),
                status: 1,
              },
              update: {
                status: i.status,
                price: i.price,
                point: i.point,
                pointStatus: i.pointStatus,
                name: i.name,
                updatedAt: dayjs().unix(),
              },
            }
          }),
        },
      },
      where: {
        id,
      },
    })
  }

  deleteOne(id: number) {
    return this.prismaService.$transaction([
      this.prismaService.product.update({ where: { id }, data: { status: 0 } }),
      this.prismaService.productSku.updateMany({
        where: { productId: id },
        data: { status: 0 },
      }),
    ])
  }
}
