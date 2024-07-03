import { PartialType } from '@nestjs/mapped-types';
import { CreateUserProductPackDto } from './create-user-product-pack.dto';

export class UpdateUserProductPackDto extends PartialType(CreateUserProductPackDto) {}
