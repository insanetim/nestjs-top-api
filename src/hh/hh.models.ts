export interface IMovie {
  id: number | string
  original_language: string
  overview?: string
  poster_path?: string
  release_date?: string
  title: string
}

export interface IMoviesList {
  page: number
  results: IMovie[]
  total_pages: number
  total_results: number
}
