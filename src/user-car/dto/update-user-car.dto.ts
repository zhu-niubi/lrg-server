import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateUserCarDto } from './create-user-car.dto'

export class UpdateUserCarDto extends PartialType(
  OmitType(CreateUserCarDto, ['phoneNumber']),
) {}
