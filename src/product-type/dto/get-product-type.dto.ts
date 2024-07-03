import { IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetProductTypeDto extends GetPageNationDTO {
  @IsString()
  @IsOptional()
  name: string
}
