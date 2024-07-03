import { Transform } from 'class-transformer'
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateRollDto {
  @IsString()
  rollNumber: string
  @IsInt()
  productId: number
  @IsInt()
  @IsOptional()
  official: number
  @IsNumber()
  @Transform(({ value }) => value * 10)
  length: number
}
