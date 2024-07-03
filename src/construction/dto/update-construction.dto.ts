import { PartialType } from '@nestjs/mapped-types'
import { IsInt, IsOptional } from 'class-validator'
import { CreateConstructionDTO } from './create-construction.dto'

export class UpdateConstructionDTO extends PartialType(CreateConstructionDTO) {
  @IsOptional()
  checkSign: string
  @IsOptional()
  checkSignAgain: string
}

export class BackConstructionDTO {
  @IsInt()
  constructionId: number
  @IsInt()
  status: number
}
