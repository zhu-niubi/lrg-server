import { Type } from 'class-transformer'
import { IsArray, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetProductDTO extends GetPageNationDTO {
  @IsOptional()
  name: string
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productTypeId: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  storeId: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  productModelId: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  productId: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  type: number
  @IsOptional()
  @IsString()
  productModelName: string
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  saleStatus: number
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  pointStatus: number
}
