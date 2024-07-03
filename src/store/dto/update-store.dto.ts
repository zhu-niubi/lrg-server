import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateStoreDTO } from './create-store.dto'

export class UpdateStoreDTO extends PartialType(
  OmitType(CreateStoreDTO, ['phoneNumber']),
) {}
