import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator'

export class AdminLogin {
  @IsString()
  username: string
  @IsString()
  password: string
}

export class ClientLogin {
  @IsString()
  jsCode: string
  @IsString()
  @IsOptional()
  nickname: string
  @IsInt()
  @IsOptional()
  recommenderId: number
}

export class ClientPhoneLogin {
  @IsString()
  code: string
  @IsNumber()
  @IsOptional()
  recommenderId: number
}
