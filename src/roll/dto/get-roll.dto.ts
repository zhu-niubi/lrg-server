import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetRollDto extends GetPageNationDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productId: number
  @IsOptional()
  rollNumber: string
}
