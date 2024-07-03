import { Injectable } from '@nestjs/common'
import { CreatePointRecordDto } from './dto/create-point-record.dto'
import { UpdatePointRecordDto } from './dto/update-point-record.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetPointRecordDTO } from './dto/get-point-record.dto'

@Injectable()
export class PointRecordService {
  constructor(private prismaService: PrismaService) {}
  create(createPointRecordDto: CreatePointRecordDto) {
    return 'This action adds a new pointRecord'
  }

  async findAll(getPointRecordDTO: GetPointRecordDTO) {
    const result = await this.prismaService.table('pointRecord')({
      pageSize: getPointRecordDTO.pageSize,
      pageNumber: getPointRecordDTO.pageNumber,
      orderBy: {
        id: 'desc',
      },
      where: {
        user: {
          phoneNumber: getPointRecordDTO.phoneNumber,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
      },
    })
    result.list.forEach((i: any) => {
      i.userName = i.user.name
      i.phoneNumber = i.user.phoneNumber
      delete i.user
    })
    return result
  }

  findOne(id: number) {
    return `This action returns a #${id} pointRecord`
  }

  update(id: number, updatePointRecordDto: UpdatePointRecordDto) {
    return `This action updates a #${id} pointRecord`
  }

  remove(id: number) {
    return `This action removes a #${id} pointRecord`
  }
}
