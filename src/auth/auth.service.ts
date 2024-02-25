import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { genSaltSync, hashSync } from 'bcryptjs'

import { User } from '../schemas/user.schema'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(dto: AuthDto) {
    const salt = genSaltSync(10)
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: hashSync(dto.password, salt),
    })
    return newUser.save()
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec()
  }
}
