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

export interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface MovieDetails extends Movie {
  belongs_to_collection: Collection | null
  budget: number
  genres: Genre[]
  homepage: string
  imdb_id: string
  origin_country: string[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  revenue: number
  runtime: number
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
}

export interface ApiError {
  message: string
  status_code?: number
}

export interface ApiState {
  isLoading: boolean
  error: string | null
  isRefreshing?: boolean
}

export type RootStackParamList = {
  MovieList: undefined
  MovieDetails: { movieId: number; movie?: Movie }
}

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

export interface ApiConfig {
  baseUrl: string
  apiKey: string
  imageBaseUrl: string
}
