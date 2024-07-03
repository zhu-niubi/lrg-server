import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProductModelService {
  constructor(private prismaService: PrismaService) {}
  getAll({
    pageNumber,
    pageSize,
    name,
    productTypeId,
    tag,
  }: {
    pageSize?: number
    pageNumber?: number
    name?: string
    productTypeId?: number
    tag?: string
  }) {
    return this.prismaService
      .findAndCount({
        pageNumber,
        pageSize,
        include: {
          productType: {
            select: {
              name: true,
            },
          },
        },
        where: {
          productType: {
            id: productTypeId,
          },
          tag,
          name: { contains: name },
          status: 1,
        },
        tableName: 'productModel',
      })
      .then(result => {
        result.list.forEach((i: any) => {
          i.productTypeName = i.productType.name
          delete i.productType
        })
        return result
      })
  }

  addOne({
    name,
    productTypeId,
    tag = '',
    sort,
  }: {
    name: string
    tag?: string
    productTypeId: number
    sort: number
  }) {
    return this.prismaService.productModel.create({
      data: {
        name,
        tag,
        sort,
        productTypeId,
      },
    })
  }

  editOne(
    {
      name,
      productTypeId,
      tag,
      sort,
    }: {
      name?: string
      tag?: string
      productTypeId?: number
      sort?: number
    },
    id: number,
  ) {
    return this.prismaService.productModel.update({
      data: {
        name,
        tag,
        productTypeId,
        sort,
      },
      where: {
        id,
      },
    })
  }

  deleteOne(id: number) {
    return this.prismaService.productModel.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
