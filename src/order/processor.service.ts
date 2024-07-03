import { closeWxPayOrder } from '@lib/wx-pay'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import dayjs from 'dayjs'
import { PrismaService } from 'src/prisma/prisma.service'

@Processor('orderQueue')
export class MyProcessor {
  constructor(private prismaService: PrismaService) {}
  @Process('dead')
  processJob(job: Job<{ orderNumber: string }>) {
    const { orderNumber } = job.data
    return this.prismaService.$transaction(async prisma => {
      const result = await prisma.order.findFirst({
        where: { orderNumber, status: 1, payStage: 1 },
      })
      if (result?.deadline <= dayjs().unix()) {
        await closeWxPayOrder(orderNumber).catch(err => {
          console.log(err)
        })
        return prisma.order.update({
          where: { orderNumber },
          data: {
            payment: {
              updateMany: {
                data: { status: 0 },
                where: {},
              },
            },
            status: 0,
            deleteReason: '超时',
            deleteAt: dayjs().unix(),
          },
        })
      }
    })
  }
}
