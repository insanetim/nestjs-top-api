import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { AxiosError } from 'axios'
import { catchError, firstValueFrom } from 'rxjs'

import { API_URL } from './hh.constants'
import { IMoviesList } from './hh.models'
import { HhData } from '../schemas/top-page.schema'

@Injectable()
export class HhService {
  private token: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.token = this.configService.get<string>('TMDB_TOKEN') ?? ''
  }

  async getData(query: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<IMoviesList>(API_URL.search, {
          params: { query, page: 1 },
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + this.token,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error)
            throw 'An error happened!'
          })
        )
    )

    return this.parseData(data)
  }

  private parseData(data: IMoviesList): HhData {
    const count = data.results.length
    const titles = data.results.reduce<string[]>(
      (acc, item) => acc.concat(item.title),
      []
    )

    return { count, titles, updatedAt: new Date() }
  }
}
