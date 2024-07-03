import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetCouponTemplateDTO extends GetPageNationDTO {
  @IsOptional()
  name?: string
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  startTime?: number
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  endTime?: number
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productId: number
}
