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

import { Product } from '../schemas/product.schema'
import { FindProductDto } from './dto/find-product.dto'

@Controller('product')
export class ProductController {
  @Post('create')
  async create(@Body() dto: Omit<Product, '_id'>) {}

  @Get(':id')
  async get(@Param('id') id: string) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: Product) {}

  @Post()
  @HttpCode(200)
  async find(@Body() dto: FindProductDto) {}
}
