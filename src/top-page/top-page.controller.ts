import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { TopPage } from '../schemas/top-page.schema'
import { FindTopPageDto } from './dto/find-top-page.dto'

@Controller('top-page')
export class TopPageController {
  @Post('create')
  async create(@Body() dto: Omit<TopPage, '_id'>) {}

  @Get(':id')
  async get(@Param('id') id: string) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: TopPage) {}

  @Post()
  @HttpCode(200)
  async find(@Body() dto: FindTopPageDto) {}
}
