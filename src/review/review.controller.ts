import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'

import { ReviewService } from './review.service'
import { CreateReviewDto } from './dto/create-review.dto'
import { REVIEW_NOT_FOUND_ERROR } from './review.constants'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { UserEmail } from '../decorators/user-email.decorator'
import { IdValidationPipe } from '../pipes/id-validation.pipe'
import { TelegramService } from '../telegram/telegram.service'

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto)
  }

  @UsePipes(new ValidationPipe())
  @Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
    const message =
      `Имя: ${dto.name}\n` +
      `Заголовок: ${dto.title}\n` +
      `Описание: ${dto.description}\n` +
      `Рейтинг: ${dto.rating}\n` +
      `ID продукта: ${dto.productId}`

    return this.telegramService.sendMessage(message)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', IdValidationPipe) id: string,
    @UserEmail() email: string
  ) {
    // console.log(email)
    const deletedDoc = await this.reviewService.deleteById(id)
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND)
    }

    return deletedDoc
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string) {
    return this.reviewService.findByProductId(productId)
  }
}
