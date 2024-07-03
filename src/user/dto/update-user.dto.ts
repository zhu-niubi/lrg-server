import { PartialType, OmitType } from '@nestjs/mapped-types'
import {
  CreateAdminDto,
  CreateEmployeeDto,
  CreateUserDto,
} from './create-user.dto'

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['openId']),
) {}
export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
