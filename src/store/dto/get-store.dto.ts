import { IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetStoreDTO extends GetPageNationDTO {
  @IsOptional()
  name: string
  @IsOptional()
  region: string
}
