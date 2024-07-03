import { IsInt, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetUserCarDto extends GetPageNationDTO {
  @IsString()
  @IsOptional()
  keyword: string
  @IsInt()
  @IsOptional()
  userId: number
}
