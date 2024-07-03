import { Module } from '@nestjs/common'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { BullModule } from '@nestjs/bull'
import { MyProcessor } from './processor.service'
import { SocketService } from '@controller/ws/message.gateway'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'orderQueue',
      configKey: 'redisKey',
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, MyProcessor, SocketService],
  exports: [OrderService],
})
export class OrderModule {}
