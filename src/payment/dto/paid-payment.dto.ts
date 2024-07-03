import { IsObject, IsString } from 'class-validator'

export class PaidPaymentDto {
  @IsString()
  id: string
  @IsString()
  create_time: string
  @IsString()
  event_type: string
  @IsString()
  resource_type: string
  @IsObject()
  resource: {
    algorithm: string
    ciphertext: string
    original_type: string
    nonce: string
    associated_data: string
  }
  @IsString()
  summary: string
}
