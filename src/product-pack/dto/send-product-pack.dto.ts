import { IsInt, IsOptional, IsString } from 'class-validator'

export class SendProductPackDto {
  @IsInt({ each: true })
  userId: number[]
  @IsInt()
  productPackId: number
  @IsOptional()
  @IsInt({ each: true })
  applyStore: number[]
  @IsInt()
  @IsOptional()
  storeId: number
  @IsInt()
  @IsOptional()
  emplpyeeId: number
  @IsString()
  memo: string
}
