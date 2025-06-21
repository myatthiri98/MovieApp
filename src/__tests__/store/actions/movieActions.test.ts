import { describe, expect, it } from 'vitest'
import {
  fetchUpcomingMoviesRequest,
  fetchUpcomingMoviesSuccess,
  fetchUpcomingMoviesFailure,
  fetchPopularMoviesRequest,
  fetchPopularMoviesSuccess,
  fetchPopularMoviesFailure,
  fetchMovieDetailsRequest,
  fetchMovieDetailsSuccess,
  fetchMovieDetailsFailure,
  toggleFavorite,
  loadFavorites,
  loadFavoritesSuccess,
  setNetworkStatus,
} from '@/store/actions/movieActions'
import { Movie, MovieDetails } from '@/types'

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 12],
  adult: false,
  original_language: 'en',
  original_title: 'Test Movie',
  popularity: 100,
  video: false,
  isFavorite: false,
}

const mockMovieDetails: MovieDetails = {
  ...mockMovie,
  belongs_to_collection: null,
  budget: 100000000,
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ],
  homepage: 'https://test-movie.com',
  imdb_id: 'tt1234567',
  origin_country: ['US'],
  production_companies: [
    {
      id: 1,
      name: 'Test Studio',
      logo_path: '/logo.jpg',
      origin_country: 'US',
    },
  ],
  production_countries: [
    { iso_3166_1: 'US', name: 'United States of America' },
  ],
  revenue: 500000000,
  runtime: 120,
  spoken_languages: [
    { english_name: 'English', iso_639_1: 'en', name: 'English' },
  ],
  status: 'Released',
  tagline: 'Test tagline',
}

describe('Movie Actions', () => {
  describe('Request actions', () => {
    const requestTestCases = [
      {
        action: fetchUpcomingMoviesRequest,
        type: 'movies/fetchUpcomingMoviesRequest',
        payload: { page: 1 },
        description: 'upcoming movies page 1',
      },
      {
        action: fetchUpcomingMoviesRequest,
        type: 'movies/fetchUpcomingMoviesRequest',
        payload: { page: 2, refresh: true },
        description: 'upcoming movies page 2 with refresh',
      },
      {
        action: fetchPopularMoviesRequest,
        type: 'movies/fetchPopularMoviesRequest',
        payload: { page: 1 },
        description: 'popular movies page 1',
      },
      {
        action: fetchPopularMoviesRequest,
        type: 'movies/fetchPopularMoviesRequest',
        payload: { page: 3, refresh: false },
        description: 'popular movies page 3 without refresh',
      },
    ]

    it.each(requestTestCases)(
      'should create $description request action',
      ({ action, type, payload }) => {
        const result = action(payload)
        expect(result.type).toBe(type)
        expect(result.payload).toEqual(payload)
      },
    )

    it('should create movie details request action', () => {
      const payload = { movieId: 123 }
      const result = fetchMovieDetailsRequest(payload)
      expect(result.type).toBe('movies/fetchMovieDetailsRequest')
      expect(result.payload).toEqual(payload)
    })
  })

  describe('Success actions', () => {
    const successTestCases = [
      {
        action: fetchUpcomingMoviesSuccess,
        type: 'movies/fetchUpcomingMoviesSuccess',
        payload: { movies: [mockMovie], page: 1, hasMore: true },
        description: 'upcoming movies success',
      },
      {
        action: fetchUpcomingMoviesSuccess,
        type: 'movies/fetchUpcomingMoviesSuccess',
        payload: { movies: [], page: 5, hasMore: false },
        description: 'upcoming movies success with no more pages',
      },
      {
        action: fetchPopularMoviesSuccess,
        type: 'movies/fetchPopularMoviesSuccess',
        payload: {
          movies: [mockMovie, { ...mockMovie, id: 2 }],
          page: 2,
          hasMore: true,
        },
        description: 'popular movies success with multiple movies',
      },
    ]

    it.each(successTestCases)(
      'should create $description action',
      ({ action, type, payload }) => {
        const result = action(payload)
        expect(result.type).toBe(type)
        expect(result.payload).toEqual(payload)
      },
    )

    it('should create movie details success action', () => {
      const payload = { movieDetails: mockMovieDetails }
      const result = fetchMovieDetailsSuccess(payload)
      expect(result.type).toBe('movies/fetchMovieDetailsSuccess')
      expect(result.payload).toEqual(payload)
    })
  })

  describe('Failure actions', () => {
    const failureTestCases = [
      {
        action: fetchUpcomingMoviesFailure,
        type: 'movies/fetchUpcomingMoviesFailure',
        payload: { error: 'Network error' },
        description: 'upcoming movies failure',
      },
      {
        action: fetchPopularMoviesFailure,
        type: 'movies/fetchPopularMoviesFailure',
        payload: { error: 'API timeout' },
        description: 'popular movies failure',
      },
      {
        action: fetchUpcomingMoviesFailure,
        type: 'movies/fetchUpcomingMoviesFailure',
        payload: { error: 'Server error 500' },
        description: 'upcoming movies server error',
      },
    ]

    it.each(failureTestCases)(
      'should create $description action',
      ({ action, type, payload }) => {
        const result = action(payload)
        expect(result.type).toBe(type)
        expect(result.payload).toEqual(payload)
      },
    )

    it('should create movie details failure action', () => {
      const payload = { error: 'Movie not found', movieId: 999 }
      const result = fetchMovieDetailsFailure(payload)
      expect(result.type).toBe('movies/fetchMovieDetailsFailure')
      expect(result.payload).toEqual(payload)
    })
  })

  describe('Favorite actions', () => {
    const favoriteTestCases = [
      {
        movie: mockMovie,
        description: 'regular movie',
      },
      {
        movie: {
          ...mockMovie,
          id: 2,
          title: 'Another Movie',
          isFavorite: true,
        },
        description: 'already favorite movie',
      },
      {
        movie: { ...mockMovie, id: 3, title: 'Third Movie', poster_path: null },
        description: 'movie without poster',
      },
    ]

    it.each(favoriteTestCases)(
      'should create toggle favorite action for $description',
      ({ movie }) => {
        const result = toggleFavorite({ movie })
        expect(result.type).toBe('movies/toggleFavorite')
        expect(result.payload).toEqual({ movie })
      },
    )

    it('should create load favorites action', () => {
      const result = loadFavorites()
      expect(result.type).toBe('movies/loadFavorites')
      expect(result.payload).toBeUndefined()
    })

    const favoritesTestCases = [
      {
        favorites: [],
        description: 'empty favorites list',
      },
      {
        favorites: [mockMovie],
        description: 'single favorite movie',
      },
      {
        favorites: [mockMovie, { ...mockMovie, id: 2, title: 'Movie 2' }],
        description: 'multiple favorite movies',
      },
    ]

    it.each(favoritesTestCases)(
      'should create load favorites success action with $description',
      ({ favorites }) => {
        const result = loadFavoritesSuccess({ favorites })
        expect(result.type).toBe('movies/loadFavoritesSuccess')
        expect(result.payload).toEqual({ favorites })
      },
    )
  })

  describe('Network actions', () => {
    const networkTestCases = [
      {
        isConnected: true,
        description: 'connected state',
      },
      {
        isConnected: false,
        description: 'disconnected state',
      },
    ]

    it.each(networkTestCases)(
      'should create set network status action for $description',
      ({ isConnected }) => {
        const result = setNetworkStatus({ isConnected })
        expect(result.type).toBe('network/setNetworkStatus')
        expect(result.payload).toEqual({ isConnected })
      },
    )
  })
})
