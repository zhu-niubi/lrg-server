import { IsOptional, IsString } from 'class-validator'
import { GetPageNationDTO } from 'src/DTO/pageNation.dto'

export class GetPointRecordDTO extends GetPageNationDTO {
  @IsString()
  @IsOptional()
  phoneNumber: string
}
