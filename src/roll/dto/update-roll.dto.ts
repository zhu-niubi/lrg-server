import { PartialType } from '@nestjs/mapped-types';
import { CreateRollDto } from './create-roll.dto';

export class UpdateRollDto extends PartialType(CreateRollDto) {}
