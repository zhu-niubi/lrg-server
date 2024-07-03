import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetUserDTO extends GetPageNationDTO {
  @IsString()
  @IsOptional()
  openId: string
  @IsString()
  @IsOptional()
  phoneNumber: string
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  userId: number
}
