import { ApiConfig } from '../types'

export const API_CONFIG: ApiConfig = {
  baseUrl: 'https://api.themoviedb.org/3',
  apiKey: '6b23d3794c4bd48bc164969335f74764',
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
