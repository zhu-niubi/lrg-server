import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettlementOrderService } from './settlement_order.service';
import { CreateSettlementOrderDto } from './dto/create-settlement_order.dto';
import { UpdateSettlementOrderDto } from './dto/update-settlement_order.dto';

@Controller('settlement-order')
export class SettlementOrderController {
  constructor(private readonly settlementOrderService: SettlementOrderService) {}

  @Post()
  create(@Body() createSettlementOrderDto: CreateSettlementOrderDto) {
    return this.settlementOrderService.create(createSettlementOrderDto);
  }

  @Get()
  findAll() {
    return this.settlementOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settlementOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettlementOrderDto: UpdateSettlementOrderDto) {
    return this.settlementOrderService.update(+id, updateSettlementOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settlementOrderService.remove(+id);
  }
}
