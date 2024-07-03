import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'
export class GetCouponVo extends GetPageNationDTO {
  @IsString()
  @IsOptional()
  code?: string
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  startTime?: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  endTime?: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  couponTemplateId?: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  userId?: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  status?: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  storeId?: number
  @IsString()
  @IsOptional()
  phoneNumber?: string
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  productId?: number
}
