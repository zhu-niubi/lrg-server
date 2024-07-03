import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetCarDto extends GetPageNationDTO {
  @IsOptional()
  @Type(() => Number)
  carBrandId?: number
}
