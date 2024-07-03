import { Injectable } from '@nestjs/common'
import { CreatePointDto } from './dto/create-point.dto'
import { UpdatePointDto } from './dto/update-point.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import dayjs from 'dayjs'

@Injectable()
export class PointService {
  constructor(private prismaService: PrismaService) {}

  create({ userId, ...createPointDto }: CreatePointDto) {
    let sum = 0
    return this.prismaService.$transaction(async prisma => {
      let point = await prisma.point.findFirst({
        select: { id: true, quantity: true },
        where: { userId },
      })
      if (!point) {
        await prisma.point.create({
          data: {
            userId,
            quantity: createPointDto.quantity,
            createdAt: dayjs().unix(),
            updatedAt: dayjs().unix(),
          },
        })
        sum = createPointDto.quantity
      } else {
        sum = Math.floor(point.quantity + createPointDto.quantity)
        await prisma.pointRecord.create({
          data: {
            action: createPointDto.action,
            userId,
            quantity: createPointDto.quantity,
            sum,
            orderId: 0,
            memo: createPointDto.memo || '',
          },
        })
      }

      return prisma.point.update({
        where: { userId },
        data: {
          quantity: sum,
        },
      })
    })
  }

  findAll() {
    return `This action returns all point`
  }

  findOne(id: number) {
    return `This action returns a #${id} point`
  }

  update(id: number, updatePointDto: UpdatePointDto) {
    return `This action updates a #${id} point`
  }

  remove(id: number) {
    return `This action removes a #${id} point`
  }
}
