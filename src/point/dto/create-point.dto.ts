import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CreatePointDto {
  @IsInt()
  @Min(0)
  userId: number
  @IsInt()
  @Min(0)
  quantity: number
  @IsInt()
  @Min(0)
  action: number
  @IsString()
  @IsOptional()
  memo: string
}
