import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetProductSkuDTO extends GetPageNationDTO {
  @IsOptional()
  name: string
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  productId: number
}
