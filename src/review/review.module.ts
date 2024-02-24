import { Module } from '@nestjs/common'

import { ReviewController } from './review.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Review, ReviewSchema } from '../schemas/review.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
