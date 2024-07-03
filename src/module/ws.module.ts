import { Module } from '@nestjs/common';
import { SocketService } from '@controller/ws/message.gateway';

@Module({
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketsModule {}
