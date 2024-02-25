import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { disconnect } from 'mongoose'

import { AppModule } from '../src/app.module'
import { AuthDto } from '../src/auth/dto/auth.dto'
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from '../src/auth/auth.constants'

const loginDto: AuthDto = {
  login: 'a@mail.com',
  password: 'qwerty',
}

describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/auth/login (POST) - success', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)

    expect(body.access_token).toBeDefined()
  })

  it('/auth/login (POST) - failed login', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'aaa@mail.com' })
      .expect(401, {
        message: USER_NOT_FOUND_ERROR,
        error: 'Unauthorized',
        statusCode: 401,
      })
  })

  it('/auth/login (POST) - failed password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: 'password' })
      .expect(401, {
        message: WRONG_PASSWORD_ERROR,
        error: 'Unauthorized',
        statusCode: 401,
      })
  })

  afterAll(() => {
    disconnect()
  })
})
