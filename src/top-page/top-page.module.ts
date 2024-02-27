import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { TopPage, TopPageSchema } from '../schemas/top-page.schema'
import { TopPageController } from './top-page.controller'
import { TopPageService } from './top-page.service'
import { HhService } from '../hh/hh.service'
import { HhModule } from '../hh/hh.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TopPage.name, schema: TopPageSchema }]),
    HhModule,
  ],
  controllers: [TopPageController],
  providers: [TopPageService],
  exports: [TopPageService],
})
export class TopPageModule {}
