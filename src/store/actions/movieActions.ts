import { createAction } from '@reduxjs/toolkit'
import { Movie, MovieDetails } from '@/types'

export const fetchUpcomingMoviesRequest = createAction<{
  page: number
  refresh?: boolean
}>('movies/fetchUpcomingMoviesRequest')
export const fetchUpcomingMoviesSuccess = createAction<{
  movies: Movie[]
  page: number
  hasMore: boolean
}>('movies/fetchUpcomingMoviesSuccess')
export const fetchUpcomingMoviesFailure = createAction<{ error: string }>(
  'movies/fetchUpcomingMoviesFailure',
)

export const fetchPopularMoviesRequest = createAction<{
  page: number
  refresh?: boolean
}>('movies/fetchPopularMoviesRequest')
export const fetchPopularMoviesSuccess = createAction<{
  movies: Movie[]
  page: number
  hasMore: boolean
}>('movies/fetchPopularMoviesSuccess')
export const fetchPopularMoviesFailure = createAction<{ error: string }>(
  'movies/fetchPopularMoviesFailure',
)

export const fetchMovieDetailsRequest = createAction<{ movieId: number }>(
  'movies/fetchMovieDetailsRequest',
)
export const fetchMovieDetailsSuccess = createAction<{
  movieDetails: MovieDetails
}>('movies/fetchMovieDetailsSuccess')
export const fetchMovieDetailsFailure = createAction<{
  error: string
  movieId: number
}>('movies/fetchMovieDetailsFailure')

export const toggleFavorite = createAction<{ movie: Movie }>(
  'movies/toggleFavorite',
)
export const loadFavorites = createAction('movies/loadFavorites')
export const loadFavoritesSuccess = createAction<{ favorites: Movie[] }>(
  'movies/loadFavoritesSuccess',
)

export const setNetworkStatus = createAction<{ isConnected: boolean }>(
  'network/setNetworkStatus',
)

export const setRefreshing = createAction<{
  movieType: 'upcoming' | 'popular'
  isRefreshing: boolean
}>('movies/setRefreshing')
