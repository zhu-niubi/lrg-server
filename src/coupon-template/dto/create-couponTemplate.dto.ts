import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateCouponTemplateDTO {
  @IsString()
  name: string
  @IsString()
  image: string
  @IsInt()
  @IsOptional()
  amount: number
  @IsInt()
  @IsOptional()
  deadline?: number
  @IsInt()
  @IsOptional()
  deadlineDay?: number
  @IsString()
  memo: string
  @IsInt()
  productId: number
  @IsInt()
  productSkuId: number
}
