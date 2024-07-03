import { PartialType } from '@nestjs/mapped-types';
import { CreatePointRecordDto } from './create-point-record.dto';

export class UpdatePointRecordDto extends PartialType(CreatePointRecordDto) {}
