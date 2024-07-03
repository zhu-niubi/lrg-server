import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateCouponVo {
  @IsInt()
  couponTemplateId: number
  @IsInt({ each: true })
  userId: number[]
  @IsOptional()
  @IsString()
  memo: string
  @IsInt({ each: true })
  applyStore: number[]
  @IsInt()
  @IsOptional()
  count = 1
}
