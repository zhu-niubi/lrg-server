import { IsOptional, IsString } from 'class-validator'

export class BindOpenIdDTO {
  @IsString()
  jsCode: string
  @IsString()
  @IsOptional()
  nickname: string
  @IsString()
  @IsOptional()
  avatarUrl: string
}
