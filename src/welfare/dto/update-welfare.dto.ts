import { PartialType } from '@nestjs/mapped-types';
import { CreateWelfareDto } from './create-welfare.dto';

export class UpdateWelfareDto extends PartialType(CreateWelfareDto) {}
