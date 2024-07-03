import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetRecommendDto extends GetPageNationDTO {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  recommenderId: number
}
