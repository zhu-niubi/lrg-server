import { IsOptional, IsString } from 'class-validator'

export class CreateStoreDTO {
  @IsString({ each: true })
  @IsOptional()
  images: string[]
  @IsString()
  name: string
  @IsString()
  region: string
  @IsString()
  contact: string
  @IsString()
  phoneNumber: string
  @IsString()
  fullAddress: string
  @IsString()
  lat: string
  @IsString()
  lon: string
}
