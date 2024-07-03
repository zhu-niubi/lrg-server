import { Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator'

export class CreateProductPackDto {
  @IsNumber()
  price: number
  @IsString()
  name: string
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => Product)
  products: Product[]
  @IsNumber()
  saleStatus: number
  @IsNumber()
  type: number
  @IsString()
  pictrue: string
  @IsInt({ each: true })
  applyStore: number[]
  @IsString()
  memo: string
  @IsNumber()
  deadlineDay: number
}

export class Product {
  @IsNumber()
  productId: number
  @IsNumber()
  productSkuId: number
  @IsNumber()
  quantity: number
}
