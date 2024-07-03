import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class CreateCarBrandDTO {
  @IsString()
  name: string
  @IsString()
  image: string
  @IsString()
  initial: string
}
