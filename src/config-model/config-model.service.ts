import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ConfigModelService {
  constructor(private prismaService: PrismaService) {}
  getAll({
    type,
    parentId,
    model,
  }: {
    type?: string
    parentId?: string
    model?: string
  }) {
    return this.prismaService.configModel.findMany({
      where: {
        type: Number(type) || undefined,
        parentId: Number(parentId) || undefined,
        model,
        status: 1,
      },
    })
  }

  async addOne({
    type,
    title,
    resource,
    model,
    parentId = 0,
    tag = '',
  }: {
    type: number
    title: string
    model?: string
    parentId?: number
    tag?: string
    resource: string
  }) {
    return this.prismaService.configModel.create({
      data: {
        type,
        title,
        resource,
        model,
        parentId,
        tag,
      },
    })
  }

  editOne(
    {
      type,
      title,
      resource,
      model,
      parentId,
      tag,
    }: {
      type?: number
      title?: string
      resource?: string
      model?: string
      parentId?: number
      tag?: string
    },
    id: number,
  ) {
    return this.prismaService.configModel.update({
      where: { id },
      data: {
        type,
        title,
        model,
        resource,
        parentId,
        tag,
      },
    })
  }

  deleteOne(id: number) {
    return this.prismaService.configModel.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
