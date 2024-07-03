import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetImageDto extends GetPageNationDTO {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  type: number
}
