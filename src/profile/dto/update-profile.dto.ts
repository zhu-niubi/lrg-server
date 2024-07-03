import { IsInt, IsOptional, IsString } from 'class-validator'

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  image?: string
  @IsString()
  @IsOptional()
  password?: string
  @IsString()
  @IsOptional()
  name?: string
  @IsString()
  @IsOptional()
  phoneNumber?: string
  @IsInt()
  @IsOptional()
  birthday?: number
  @IsString()
  @IsOptional()
  avatarUrl?: string
  @IsString()
  @IsOptional()
  openId?: string
  @IsString()
  @IsOptional()
  country?: string
  @IsString()
  @IsOptional()
  area?: string
  @IsString()
  @IsOptional()
  province?: string
  @IsString()
  @IsOptional()
  city?: string
  @IsInt()
  @IsOptional()
  gender?: number
  @IsString()
  @IsOptional()
  nickname?: string
  @IsInt()
  @IsOptional()
  level?: number
}
