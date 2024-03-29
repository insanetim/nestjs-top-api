import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { Types, disconnect } from 'mongoose'

import { AppModule } from '../src/app.module'
import { CreateReviewDto } from '../src/review/dto/create-review.dto'
import { REVIEW_NOT_FOUND_ERROR } from '../src/review/review.constants'
import { AuthDto } from '../src/auth/dto/auth.dto'

const productId = new Types.ObjectId().toHexString()

const loginDto: AuthDto = {
  login: 'a@mail.com',
  password: 'qwerty',
}

const testDto: CreateReviewDto = {
  name: 'test_name',
  title: 'test_title',
  description: 'test_description',
  rating: 5,
  productId,
}

describe('ReviewController (e2e)', () => {
  let app: INestApplication
  let createdId: string
  let token: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
    token = body.access_token
  })

  it('/review/create (POST) - success', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)

    createdId = body._id
    expect(createdId).toBeDefined()
  })

  it('/review/create (POST) - failed', async () => {
    await request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400)
  })

  it('/review/byProduct/:productId (GET) - success', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(200)

    expect(body.length).toBe(0)
  })

  it('/review/byProduct/:productId (GET) - failed', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200)

    expect(body.length).toBe(1)
  })

  it('/review/:id (DELETE) - success', async () => {
    await request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('/review/:id (DELETE) - failed', async () => {
    await request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND_ERROR })
  })

  afterAll(() => {
    disconnect()
  })
})
