import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProductTypeService {
  constructor(private prismaService: PrismaService) {}
  getAll({
    pageNumber,
    pageSize,
    name,
  }: {
    pageSize?: number
    pageNumber?: number
    name?: string
  }) {
    return this.prismaService.findAndCount({
      pageNumber,
      pageSize,
      where: {
        status: 1,
        name: {
          contains: name,
        },
      },
      tableName: 'productType',
    })
  }

  addOne({ name, picture }: { name: string; picture: string }) {
    return this.prismaService.productType.create({
      data: {
        name,
        picture,
      },
    })
  }

  editOne(
    {
      name,
      picture,
    }: {
      name?: string
      picture?: string
    },
    id: number,
  ) {
    return this.prismaService.productType
      .update({
        data: {
          name,
          picture,
        },
        where: {
          id,
        },
      })
      .catch(err => {
        throw new Error('商品类型不存在')
      })
  }

  deleteOne(id: number) {
    return this.prismaService.productType.update({
      where: { id },
      data: {
        status: 0,
        productPosition: {
          updateMany: {
            where: {
              productTypeId: id,
            },
            data: {
              status: 0,
            },
          },
        },
        productModel: {
          updateMany: {
            where: {
              productTypeId: id,
            },
            data: {
              status: 0,
            },
          },
        },
      },
    })
  }
}
