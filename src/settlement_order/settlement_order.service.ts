import { Injectable } from '@nestjs/common'
import { CreateSettlementOrderDto } from './dto/create-settlement_order.dto'
import { UpdateSettlementOrderDto } from './dto/update-settlement_order.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SettlementOrderService {
  constructor(private prismaService: PrismaService) {}
  async create(createSettlementOrderDto: CreateSettlementOrderDto) {
    const result = await this.prismaService.construction.findFirst({
      select: { id: true, status: true },
      where: {
        id: createSettlementOrderDto.constructionId,
      },
    })
    if (result.status < 7) {
      throw Error('施工单未完成，无法创建！')
    }
    return this.prismaService.settlement_order.create({
      data: {
        ...createSettlementOrderDto,
        deletedAt: 0,
      },
    })
  }

  findAll() {
    return `This action returns all settlementOrder`
  }

  findOne(id: number) {
    return `This action returns a #${id} settlementOrder`
  }

  update(id: number, updateSettlementOrderDto: UpdateSettlementOrderDto) {
    return `This action updates a #${id} settlementOrder`
  }

  remove(id: number) {
    return `This action removes a #${id} settlementOrder`
  }
}
