import { Module } from '@nestjs/common'
import { ConfigModelController } from './config-model.controller'
import { ConfigModelService } from './config-model.service'

@Module({
  controllers: [ConfigModelController],
  providers: [ConfigModelService],
})
export class ConfigModelModule {}
