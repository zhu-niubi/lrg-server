import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

class ConstructionSku {
  @IsInt()
  @IsOptional()
  id: number
  @IsInt()
  productSkuId = 0
  @IsInt()
  rollId = 0
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? value * 10 : 0))
  length = 0
  @IsInt()
  employeeId = 0
}

export class CreateConstructionDTO {
  @IsInt()
  userCarId: number
  @IsInt()
  kilometer: number
  @IsInt()
  storeId: number
  @IsString()
  defectPart: string
  @IsString({ each: true })
  defectImages: string[]
  @IsString()
  @IsOptional()
  orderNumber: string
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ConstructionSku)
  constructionSku: ConstructionSku[]
  @IsInt()
  expectComplete: number
  @IsString()
  defectType: string
  @IsString()
  @IsOptional()
  memo: string
  @IsInt()
  @IsOptional()
  status?: number
}
