import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateUserCarDto {
  @IsString()
  carNumber: string
  @IsString()
  color: string
  @IsString()
  VIN: string
  @IsInt()
  carId: number
  @IsInt()
  @IsOptional()
  userId: number
  @IsString()
  @IsOptional()
  phoneNumber: string
}
