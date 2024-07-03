import { Type } from 'class-transformer'
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetConstructionImageDto extends GetPageNationDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  constructionId: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  productId: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  productModelId: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  productTypeId: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startTime: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  endTime: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  carBrandId: number
}
