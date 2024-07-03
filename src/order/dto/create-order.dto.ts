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
  @IsOptional()
  userId: number
  @IsInt()
  @IsOptional()
  isPoint?: number
  @IsOptional()
  @IsInt()
  otherFees?: number
  @IsInt()
  @IsOptional()
  price?: number
  @IsInt()
  @IsOptional()
  pointQuantity?: number
  @IsInt()
  @IsOptional()
  storeId: number
  @Type(() => skuOrders)
  @ValidateNested({ each: true })
  skuOrders: skuOrders[]
}
