import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetProductPackDto extends GetPageNationDTO {
  @IsString()
  @IsOptional()
  name: string
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  storeId: number
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type?: number
}
