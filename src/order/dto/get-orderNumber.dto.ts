import { IsString } from 'class-validator'

export class GetOrderNumberDTO {
  @IsString()
  orderNumber: string
}
