import { IsInt, IsString } from 'class-validator'

export class CreateImageDto {
  @IsString()
  url: string
  @IsInt()
  type: number
}
