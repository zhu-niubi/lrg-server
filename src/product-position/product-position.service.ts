import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProductPositionService {
  constructor(private prismaService: PrismaService) {}
  getAll({
    pageNumber,
    pageSize,
    name,
    productTypeId,
  }: {
    pageSize?: number
    pageNumber?: number
    name?: string
    productTypeId?: number
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
          status: 1,
          productType: {
            id: productTypeId,
          },
          name: {
            contains: name,
          },
        },
        tableName: 'productPosition',
      })
      .then(result => {
        result.list.forEach((i: any) => {
          i.productTypeName = i.productType.name
          delete i.productType
        })
        return result
      })
  }

  addOne({ name, productTypeId }: { name: string; productTypeId: number }) {
    return this.prismaService.productPosition.create({
      data: {
        name,
        productTypeId,
      },
    })
  }

  editOne(
    {
      name,
      productTypeId,
    }: {
      name?: string
      productTypeId?: number
      price?: number
    },
    id: number,
  ) {
    return this.prismaService.productPosition.update({
      where: { id },
      data: {
        name,
        productTypeId,
      },
    })
  }

  deleteOne(id: number) {
    return this.prismaService.productPosition.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
