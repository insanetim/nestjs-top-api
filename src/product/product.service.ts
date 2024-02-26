import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Product } from '../schemas/product.schema'
import { CreateProductDto } from './dto/create-product.dto'
import { FindProductDto } from './dto/find-product.dto'
import { Review } from 'src/schemas/review.schema'

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  async create(dto: CreateProductDto) {
    return this.productModel.create(dto)
  }

  async findById(id: string) {
    return this.productModel.findById(id).exec()
  }

  async deleteById(id: string) {
    return this.productModel.findByIdAndDelete(id).exec()
  }

  async updateById(id: string, dto: CreateProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec()
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel
      .aggregate([
        { $match: { categories: dto.category } },
        { $sort: { _id: 1 } },
        { $limit: dto.limit },
        {
          $lookup: {
            from: 'reviews',
            //setting variable [searchId] where your string converted to ObjectId
            let: { searchId: { $toObjectId: '$productId' } },
            //search query with our [searchId] value
            pipeline: [
              //searching [searchId] value equals your field [_id]
              { $match: { $expr: [{ _id: '$searchId' }] } },
              { $sort: { createdAt: -1 } },
            ],
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewsCount: { $size: '$reviews' },
            reviewsAvg: { $avg: '$reviews.rating' },
          },
        },
      ])
      .exec() as Promise<
      (Product & {
        reviews: Review[]
        reviewsCount: number
        reviewsAvg: number
      })[]
    >
  }
}
