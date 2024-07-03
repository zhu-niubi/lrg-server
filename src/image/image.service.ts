import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
@Injectable()
export class ImageService {
  constructor(private prismaService: PrismaService) {}

  getImageAll({
    pageNumber,
    pageSize,
    type,
  }: {
    pageSize?: number
    pageNumber?: number
    type?: number
  }) {
    return this.prismaService.findAndCount({
      pageNumber,
      pageSize,
      where: {
        status: 1,
        type,
      },
      tableName: 'image',
    })
  }

  async addImage({ url, type }: { url: string; type: number }) {
    return this.prismaService.image.create({
      data: {
        url,
        type,
      },
    })
  }

  editOne(
    {
      url,
      type,
    }: {
      url?: string
      type?: number
    },
    id: number,
  ) {
    return this.prismaService.image.update({
      where: { id },
      data: {
        type,
        url,
      },
    })
  }

  deleteOne(id: number) {
    return this.prismaService.image.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
