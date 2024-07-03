import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator'

class Sort {
  @IsString()
  @IsOptional()
  @IsIn(['desc', 'asc'])
  order?: 'desc' | 'asc'
  @IsString()
  @IsOptional()
  filed?: string
}
export class GetPageNationDTO {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pageSize = 10
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageNumber = 1
}
