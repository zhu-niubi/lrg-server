import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetEmployeeDto extends GetPageNationDTO {
  @IsString()
  @IsOptional()
  name: string
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  storeId: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  position: number
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  star: number
  @IsString()
  @IsOptional()
  phoneNumber: string
}
