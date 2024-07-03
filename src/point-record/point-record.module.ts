import { Module } from '@nestjs/common';
import { PointRecordService } from './point-record.service';
import { PointRecordController } from './point-record.controller';

@Module({
  controllers: [PointRecordController],
  providers: [PointRecordService]
})
export class PointRecordModule {}
