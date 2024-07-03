import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateProductSkuDto {
  @IsInt()
  @IsOptional()
  id: number
  @IsInt()
  price: number
  @IsInt()
  @IsOptional()
  productId: number
  @IsString()
  name: string
  @IsInt()
  @IsOptional()
  status: number
  @IsInt()
  point: number
  @IsInt()
  pointStatus: number
}
