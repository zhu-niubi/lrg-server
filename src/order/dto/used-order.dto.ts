import { IsInt, IsOptional } from 'class-validator'

export class UsedOrderDTO {
  @IsInt()
  orderId: number
  @IsInt()
  @IsOptional()
  storeId: number
  @IsInt({ each: true })
  orderSkuIds: number[]
}
