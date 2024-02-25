import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose'
import { compare, genSalt, hash } from 'bcryptjs'

import { User } from '../schemas/user.schema'
import { AuthDto } from './dto/auth.dto'
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10)
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    })
    return newUser.save()
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec()
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<Pick<User, 'email'>> {
    const user = await this.findUser(email)
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR)
    }
    const isCorrectPassword = await compare(password, user.passwordHash)
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR)
    }
    return { email: user.email }
  }

  async login(email: string) {
    const payload = { email }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
