import { Type } from 'class-transformer'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateEmployeeDto {
  @IsString()
  @IsOptional()
  image: string
  @IsString()
  name: string
  @IsString()
  username: string
  @IsString()
  @IsOptional()
  password: string
  @IsString()
  phoneNumber: string
  @IsInt()
  @Type(() => Number)
  position: number
  @IsInt()
  @Type(() => Number)
  storeId: number
  @IsInt()
  @IsOptional()
  star?: number
  @IsString()
  @IsOptional()
  nickname: string
  @IsInt()
  @IsOptional()
  level?: number
  @IsInt()
  @IsOptional()
  employeementAt?: number
  @IsInt()
  @IsOptional()
  serviceNumber?: number
}
