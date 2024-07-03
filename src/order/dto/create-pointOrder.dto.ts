import { Type } from 'class-transformer'
import { IsInt, IsOptional, ValidateNested } from 'class-validator'

export class skuOrders {
  @IsInt()
  productSkuId: number
  @IsInt()
  productCount: number
}

export class CreateOrderDTO {
  @IsInt()
  userId: number
  @IsInt()
  @IsOptional()
  pointQuantity?: number
  @IsInt()
  storeId: number
  @Type(() => skuOrders)
  @ValidateNested({ each: true })
  skuOrders: skuOrders[]
}
