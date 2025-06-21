// Movie Types
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
  isFavorite?: boolean
}

export interface MovieListResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails extends Movie {
  belongs_to_collection: any
  budget: number
  genres: Genre[]
  homepage: string
  imdb_id: string
  origin_country: string[]
  production_companies: any[]
  production_countries: any[]
  revenue: number
  runtime: number
  spoken_languages: any[]
  status: string
  tagline: string
}

// API Types
export interface ApiError {
  message: string
  status_code?: number
}

export interface ApiState {
  isLoading: boolean
  error: string | null
  isRefreshing?: boolean
}

// Navigation Types
export type RootStackParamList = {
  MovieList: undefined
  MovieDetails: { movieId: number; movie?: Movie }
}

// Redux State Types
export interface MoviesState {
  upcoming: {
    movies: Movie[]
    api: ApiState
    page: number
    hasMore: boolean
  }
  popular: {
    movies: Movie[]
    api: ApiState
    page: number
    hasMore: boolean
  }
  movieDetails: {
    [key: number]: MovieDetails
  }
  favorites: Movie[]
}

export interface RootState {
  movies: MoviesState
  network: {
    isConnected: boolean
  }
}

// Config Types
export interface ApiConfig {
  baseUrl: string
  apiKey: string
  imageBaseUrl: string
}
