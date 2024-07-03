import { PartialType } from '@nestjs/mapped-types'
import { CreateOrderDTO } from './create-order.dto'
import { IsOptional, IsString } from 'class-validator'

export class UpdateOrderDTO {
  @IsOptional()
  @IsString()
  memo?: string
}
