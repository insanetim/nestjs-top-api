import { ConfigService } from '@nestjs/config'
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose'

export const getMongoConfig = async (
  configService: ConfigService
): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: configService.get<string>('MONGO_URI'),
    ...getMongoOptions(),
  }
}

const getMongoOptions = (): MongooseModuleFactoryOptions => ({
  retryWrites: true,
})
