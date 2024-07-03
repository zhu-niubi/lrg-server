import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateProductModelDto {
  @IsString()
  name: string
  @IsInt()
  @Type(() => Number)
  sort: number
  @IsString()
  @IsOptional()
  tag: string
  @IsInt()
  @Type(() => Number)
  productTypeId: number
}
