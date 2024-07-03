import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetOrderDTO extends GetPageNationDTO {
  @IsOptional()
  @IsString()
  orderNumber: string
  @IsOptional()
  @IsString()
  user: string
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  status: number
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  isPoint: number
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  payStage: number
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productId: number
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId: number
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  startTime: number
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  endTime: number
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  storeId: number
}
