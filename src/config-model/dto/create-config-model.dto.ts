import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateConfigModelDto {
  @IsString()
  title: string
  @IsInt()
  type: number
  @IsString()
  @IsOptional()
  model: string
  @IsString()
  @IsOptional()
  resource: string
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  parentId: number
  @IsString()
  @IsOptional()
  tag: string
}
