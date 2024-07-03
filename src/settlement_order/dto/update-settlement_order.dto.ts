import { PartialType } from '@nestjs/mapped-types';
import { CreateSettlementOrderDto } from './create-settlement_order.dto';

export class UpdateSettlementOrderDto extends PartialType(CreateSettlementOrderDto) {}
