import { IsInt, IsString } from 'class-validator'

export class CreateProductPositionDto {
  @IsString()
  name: string
  @IsInt()
  productTypeId: number
}
