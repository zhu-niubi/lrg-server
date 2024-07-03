import { PartialType } from '@nestjs/mapped-types'
import { CreateCarBrandDTO } from './create-carBrand.dto'

export class UpdateCarBrandDto extends PartialType(CreateCarBrandDTO) {}
