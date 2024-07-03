import { IsInt, IsOptional, IsString } from 'class-validator'

export class UpdateCouponDTO {
  @IsInt()
  @IsOptional()
  couponTemplateId: number
  @IsInt()
  @IsOptional()
  deadline: number
  @IsInt()
  @IsOptional()
  userId: number
  @IsString()
  @IsOptional()
  memo: string
  @IsString()
  @IsOptional()
  orderNumber: string
  @IsInt({ each: true })
  @IsOptional()
  applyStore: number[]
}
