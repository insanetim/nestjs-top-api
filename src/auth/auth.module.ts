import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Auth, AuthSchema } from '../schemas/auth.schema'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
