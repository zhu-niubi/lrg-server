import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class CreateCarDto extends GetPageNationDTO {
  @IsString()
  name: string
  @IsInt()
  type: number
  @IsInt()
  carBrandId: number
  @IsInt()
  @IsOptional()
  sort?: number
}
