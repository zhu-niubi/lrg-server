import { IsString } from 'class-validator'

export class RestPasswordDTO {
  @IsString()
  newPassword: string
  @IsString()
  oldPassword: string
}
