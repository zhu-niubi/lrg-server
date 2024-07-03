import { Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class GetQrcode {
  @IsString()
  scene: string
  @IsString()
  @IsOptional()
  width: string
  @IsString()
  @IsOptional()
  env_version: string
  @IsString()
  @IsOptional()
  page: string
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  is_hyaline: boolean
}

export class ToImageDTO {
  @IsString()
  code: string
  @IsNumber()
  @IsOptional()
  width?: number
}
