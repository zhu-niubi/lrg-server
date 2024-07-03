import { IsInt, IsString } from 'class-validator'

export class CreateWelfareDto {
  @IsString()
  name: string
  @IsString()
  image: string
  @IsString()
  describe: string
  @IsInt()
  level: number
}
