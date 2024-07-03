import { Type } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetUserProductPackDto extends GetPageNationDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  productPackId: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  employeeId: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  storeId: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  applyStore: number
  @IsNumber()
  @IsOptional()
  phoneNumber: string
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startTime: number
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  endTime: number
}
