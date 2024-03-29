import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule'

import { CreateTopPageDto } from './dto/create-top-page.dto'
import { FindTopPageDto } from './dto/find-top-page.dto'
import { IdValidationPipe } from '../pipes/id-validation.pipe'
import { TopPageService } from './top-page.service'
import {
  ALIAS_NOT_FOUND_ERROR,
  TOP_PAGE_NOT_FOUND_ERROR,
} from './top-page.constants'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { HhService } from '../hh/hh.service'

@Controller('top-page')
export class TopPageController {
  constructor(
    private readonly topPageService: TopPageService,
    private readonly hhService: HhService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id)
    if (!page) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }
    return page
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedPage = await this.topPageService.deleteById(id)
    if (!deletedPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }
    return deletedPage
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto
  ) {
    const updatedPage = await this.topPageService.updateById(id, dto)
    if (!updatedPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }
    return updatedPage
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias)
    if (!page) {
      throw new NotFoundException(ALIAS_NOT_FOUND_ERROR)
    }
    return page
  }

  @UsePipes(new ValidationPipe())
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory)
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.topPageService.findByText(text)
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'test' })
  async test() {
    const job = this.schedulerRegistry.getCronJob('test')
    const pages = await this.topPageService.findForHhUpdate(new Date())
    for (const page of pages) {
      const hhData = await this.hhService.getData('The Matrix')
      page.hh = hhData
      await this.topPageService.updateById(page._id, page)
    }
  }
}
