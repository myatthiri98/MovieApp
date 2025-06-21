import { TMDB_API_KEY } from '@env'
import { ApiConfig } from '../types'

export const API_CONFIG: ApiConfig = {
  baseUrl: 'https://api.themoviedb.org/3',
  apiKey: TMDB_API_KEY,
  imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
}

export const API_ENDPOINTS = {
  upcoming: '/movie/upcoming',
  popular: '/movie/popular',
  movieDetails: (id: number) => `/movie/${id}`,
  genres: '/genre/movie/list',
}

export const IMAGE_SIZES = {
  poster: 'w342',
  backdrop: 'w780',
  profile: 'w185',
}
