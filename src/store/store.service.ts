import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class StoreService {
  constructor(private prismaService: PrismaService) {}
  async getAll({
    pageNumber,
    pageSize,
    name,
    region,
  }: {
    pageSize?: number
    pageNumber?: number
    name?: string
    region?: string
  }) {
    return this.prismaService.findAndCount({
      pageNumber,
      pageSize,
      where: {
        status: 1,
        name,
        region,
      },
      tableName: 'store',
    })
  }

  getOne(id: number) {
    return this.prismaService.store.findFirst({
      where: { id },
    })
  }

  async addOne({
    images = [],
    region,
    name,
    phoneNumber,
    fullAddress,
    lat,
    contact,
    lon,
  }: {
    images?: string[]
    name: string
    region: string
    contact: string
    phoneNumber: string
    fullAddress: string
    lat: string
    lon: string
  }) {
    return this.prismaService.store.create({
      data: {
        images,
        region,
        name,
        phoneNumber,
        contact,
        fullAddress,
        lat,
        lon,
      },
    })
  }

  editOne(
    {
      images,
      region,
      name,
      phoneNumber,
      fullAddress,
      lat,
      contact,
      lon,
    }: {
      images?: string[]
      name?: string
      region?: string
      contact?: string
      phoneNumber?: string
      fullAddress?: string
      lat?: string
      lon?: string
    },
    id: number,
  ) {
    return this.prismaService.store.update({
      where: { id },
      data: {
        images,
        region,
        name,
        phoneNumber,
        fullAddress,
        lat,
        contact,
        lon,
      },
    })
  }

  deleteOne(id: number) {
    return this.prismaService.store.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
