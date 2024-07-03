import { IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetConfigModelDto extends GetPageNationDTO {
  @IsOptional()
  type: string
  @IsOptional()
  parentId: string
  @IsOptional()
  model: string
}
