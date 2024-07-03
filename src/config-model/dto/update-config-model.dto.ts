import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigModelDto } from './create-config-model.dto';

export class UpdateConfigModelDto extends PartialType(CreateConfigModelDto) {}
