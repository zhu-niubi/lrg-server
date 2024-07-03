import { Module } from '@nestjs/common'
import { SettlementOrderService } from './settlement_order.service'
import { SettlementOrderController } from './settlement_order.controller'

@Module({
  controllers: [SettlementOrderController],
  providers: [SettlementOrderService],
})
export class SettlementOrderModule {}
