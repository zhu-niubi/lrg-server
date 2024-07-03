import { Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CreateProductSkuDto } from 'src/product-sku/dto/create-product-sku.dto'

export class CreateProductDTO {
  @IsString()
  name: string
  @IsInt({ each: true })
  applyStore: number
  @IsInt()
  type: number
  @IsInt()
  productModelId: number
  @IsInt()
  saleStatus: number
  @IsOptional()
  homePicture: string
  @IsInt()
  payType: number
  @IsArray()
  banners: string[]
  @IsString()
  description: string
  @IsArray()
  @Type(() => CreateProductSkuDto)
  @ValidateNested()
  skus: CreateProductSkuDto[]
}
