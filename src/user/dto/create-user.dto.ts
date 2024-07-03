import { IsInt, IsString } from 'class-validator'

export class CreateAdminDto {
  nickname: string
  username: string
  password: string
  status: number
}

export class CreateEmployeeDto {
  image?: string | null
  name: string
  phoneNumber: string
  username: string
  password: string
  position: number
  storeId: number
}

export class CreateUserDto {
  @IsString()
  openId: string
  @IsString()
  nickname: string
  @IsString()
  name: string
  @IsInt()
  gender: number
  @IsString()
  city: string
  @IsString()
  province: string
  @IsString()
  area: string
  @IsString()
  country: string
  @IsString()
  avatarUrl: string
  @IsInt()
  birthday: number
  @IsString()
  phoneNumber: string
  @IsInt()
  level: number
}
