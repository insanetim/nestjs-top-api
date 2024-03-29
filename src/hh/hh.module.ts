import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'

import { HhService } from './hh.service'

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [HhService],
  exports: [HhService],
})
export class HhModule {}
