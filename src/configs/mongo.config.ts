import { ConfigService } from '@nestjs/config'
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose'

export const getMongoConfig = async (
  configService: ConfigService
): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  }
}

const getMongoString = (configService: ConfigService) =>
  'mongodb://' +
  configService.get<string>('MONGO_LOGIN') +
  ':' +
  configService.get<string>('MONGO_PASSWORD') +
  '@' +
  configService.get<string>('MONGO_HOST') +
  ':' +
  configService.get<string>('MONGO_PORT') +
  '/' +
  configService.get<string>('MONGO_AUTHDATABASE')

const getMongoOptions = (): MongooseModuleFactoryOptions => ({
  retryWrites: true,
})
