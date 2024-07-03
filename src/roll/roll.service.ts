import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateRollDto } from './dto/create-roll.dto'
import { GetRollDto } from './dto/get-roll.dto'
import { UpdateRollDto } from './dto/update-roll.dto'

@Injectable()
export class RollService {
  constructor(private prismaService: PrismaService) {}
  create(createRollDto: CreateRollDto) {
    return this.prismaService.roll.create({
      data: createRollDto,
    })
  }
  async findAll(query: GetRollDto) {
    const result = await this.prismaService.table('roll')({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
      where: {
        status: 1,
        productId: query.productId,
        rollNumber: query.rollNumber,
      },
    })
    result.list.forEach((i: any) => {
      i.length = i.length / 10
      i.productName = i.product.name
      delete i.product
    })
    return result
  }

  async findOne(id: number) {
    const result = await this.prismaService.roll.findFirst({
      where: { id },
    })
    return {
      ...result,
      length: result.length / 10,
    }
  }

  update(id: number, updateRollDto: UpdateRollDto) {
    return this.prismaService.roll.update({
      data: updateRollDto,
      where: { id },
    })
  }

  remove(id: number) {
    return this.prismaService.roll.update({
      data: { status: 0 },
      where: { id },
    })
  }
}
