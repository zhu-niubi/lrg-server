import { Transform, Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetConstructionDTO extends GetPageNationDTO {
  @IsString()
  @IsOptional()
  phoneNumber?: string
  @IsOptional()
  carNumber?: string
  @IsOptional()
  orderNumber?: string
  @IsOptional()
  @Type(() => Number)
  carId?: number
  @IsOptional()
  @Type(() => Number)
  userId?: number
  @IsOptional()
  @Type(() => Number)
  productId?: number
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  rollId?: number
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  storeId?: number
  @IsOptional()
  code?: string
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userCarId?: number
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  status?: number
}
