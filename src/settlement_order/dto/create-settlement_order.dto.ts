import { IsInt } from 'class-validator'

export class CreateSettlementOrderDto {
  @IsInt()
  constructionId: number
  @IsInt()
  paymentMethod: number
  @IsInt()
  otherPrice: number
  @IsInt()
  price: number
}
