import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
@Injectable()
export class WelfareService {
  constructor(private prismaService: PrismaService) {}
  getWelfareAll(level?: number) {
    return this.prismaService.welfare.findMany({
      where: { status: 1, level: { lte: level } },
    })
  }

  async add({
    name,
    describe,
    image,
    level,
  }: {
    name: string
    describe: string
    image: string
    level: number
  }) {
    return this.prismaService.welfare.create({
      data: {
        name,
        describe,
        image,
        level,
      },
    })
  }

  editOne(
    {
      name,
      describe,
      image,
      level,
    }: {
      name?: string
      describe?: string
      image?: string
      level?: number
    },
    id: number,
  ) {
    return this.prismaService.welfare.update({
      where: { id },
      data: {
        name,
        describe,
        image,
        level,
      },
    })
  }

  deleteOne(id: number) {
    return this.prismaService.welfare.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
