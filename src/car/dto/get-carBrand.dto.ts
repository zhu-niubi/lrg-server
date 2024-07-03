import { IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetCarBrand extends GetPageNationDTO {
  @IsOptional()
  initial: string
  @IsOptional()
  name: string
}
