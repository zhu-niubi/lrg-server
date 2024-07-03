import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class CarService {
  constructor(private prismaService: PrismaService) {}
  getCarBrandAll({
    pageNumber,
    pageSize,
    name,
    initial,
  }: {
    pageSize?: number
    pageNumber?: number
    initial?: string
    name?: string
  }) {
    return this.prismaService.table('carBrand')({
      pageNumber,
      pageSize,
      orderBy: { initial: 'asc' },
      where: {
        status: 1,
        name: {
          contains: name,
        },
        initial,
      },
    })
  }
  async getCarAll({
    pageNumber,
    pageSize,
    carBrandId,
  }: {
    pageSize?: number
    pageNumber?: number
    carBrandId?: number
  }) {
    const result = await this.prismaService.table('car')({
      pageNumber,
      pageSize,
      orderBy: [
        {
          carBrand: {
            initial: 'asc',
          },
        },
        {
          id: 'asc',
        },
        {
          sort: 'desc',
        },
      ],
      include: {
        carBrand: {
          select: {
            name: true,
          },
        },
      },
      where: {
        status: 1,
        carBrand: {
          id: Number(carBrandId) || { not: undefined },
        },
      },
    })
    result.list.forEach((i: any) => {
      i.carBrandName = i.carBrand.name
      delete i.carBrand
    })
    return result
  }

  async addCarBrandOne({
    name,
    initial,
    image,
  }: {
    name: string
    initial: string
    image: string
  }) {
    try {
      return this.prismaService.carBrand.create({
        data: {
          name,
          initial,
          image,
        },
      })
    } catch (err) {
      const errResult = await this.prismaService.carBrand.findFirst({
        where: { name },
      })
      if (errResult) {
        return `该名称已存在${name}`
      }
      throw err
    }
  }

  addCarOne({
    name,
    type,
    carBrandId,
    sort = 0,
  }: {
    name: string
    type: number
    carBrandId: number
    sort?: number
  }) {
    return this.prismaService.car.create({
      data: {
        name,
        type,
        carBrandId,
        sort,
      },
    })
  }

  editCarOne(
    {
      name,
      type,
      carBrandId,
      sort,
    }: {
      name?: string
      type?: number
      carBrandId?: number
      sort?: number
    },
    id: number,
  ) {
    return this.prismaService.car.update({
      where: { id },
      data: {
        name,
        type,
        carBrandId,
        sort,
      },
    })
  }

  editCarBrandOne(
    {
      name,
      initial,
      image,
    }: {
      name?: string
      initial?: string
      image?: string
    },
    id: number,
  ) {
    return this.prismaService.carBrand.update({
      data: {
        name,
        initial,
        image,
      },
      where: {
        id,
      },
    })
  }

  deleteCarBrandOne(id: number) {
    return this.prismaService.carBrand.update({
      where: { id },
      data: { status: 0, name: id.toString() },
    })
  }
  deleteCarOne(id: number) {
    return this.prismaService.car.update({ where: { id }, data: { status: 0 } })
  }
}
