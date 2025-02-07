import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetProductPositionDto extends GetPageNationDTO {
  @IsString()
  @IsOptional()
  name: string
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  productTypeId: number
}
