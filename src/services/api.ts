import axios, { AxiosInstance } from 'axios'
import { Observable, from, throwError } from 'rxjs'
import { catchError, mergeMap } from 'rxjs/operators'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { API_CONFIG, API_ENDPOINTS } from '@/config/api'
import { MovieListResponse, MovieDetails, ApiError } from '@/types'

const STORAGE_KEYS = {
  UPCOMING_MOVIES: 'upcoming_movies',
  POPULAR_MOVIES: 'popular_movies',
  MOVIE_DETAILS: 'movie_details_',
  FAVORITES: 'favorites',
  LAST_FETCH: 'last_fetch_',
}

const CACHE_DURATION = 5 * 60 * 1000

export interface IApiService {
  getUpcomingMovies(page?: number): Observable<MovieListResponse>
  getPopularMovies(page?: number): Observable<MovieListResponse>
  getMovieDetails(id: number): Observable<MovieDetails>
  isOnline(): Promise<boolean>
}

export class ApiService implements IApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.axiosInstance.interceptors.request.use((config) => {
      config.params = {
        ...config.params,
        api_key: API_CONFIG.apiKey,
      }
      return config
    })

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message:
            error.response?.data?.status_message ||
            error.message ||
            'Network error',
          status_code: error.response?.status,
        }
        return Promise.reject(apiError)
      },
    )
  }

  async isOnline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch()
    return netInfo.isConnected ?? false
  }

  private async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        const now = Date.now()
        if (now - timestamp < CACHE_DURATION) {
          return data
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting cached data:', error)
    }
    return null
  }

  private async setCachedData<T>(key: string, data: T): Promise<void> {
    try {
      const cacheObject = {
        data,
        timestamp: Date.now(),
      }
      await AsyncStorage.setItem(key, JSON.stringify(cacheObject))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error setting cached data:', error)
    }
  }

  private async getOfflineData<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key)
      if (cached) {
        const { data } = JSON.parse(cached)
        return data
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting offline data:', error)
    }
    return null
  }

  getUpcomingMovies(page: number = 1): Observable<MovieListResponse> {
    const cacheKey = `${STORAGE_KEYS.UPCOMING_MOVIES}_${page}`

    return from(this.isOnline()).pipe(
      mergeMap(async (isOnline) => {
        const cachedData = await this.getCachedData<MovieListResponse>(cacheKey)
        if (cachedData && !isOnline) {
          return cachedData
        }

        if (!isOnline) {
          const offlineData =
            await this.getOfflineData<MovieListResponse>(cacheKey)
          if (offlineData) {
            return offlineData
          }
          throw new Error('No internet connection and no cached data available')
        }

        try {
          const response = await this.axiosInstance.get<MovieListResponse>(
            API_ENDPOINTS.upcoming,
            { params: { page } },
          )

          await this.setCachedData(cacheKey, response.data)

          return response.data
        } catch (error) {
          const offlineData =
            await this.getOfflineData<MovieListResponse>(cacheKey)
          if (offlineData) {
            return offlineData
          }
          throw error
        }
      }),
      catchError((error) => throwError(() => error)),
    )
  }

  getPopularMovies(page: number = 1): Observable<MovieListResponse> {
    const cacheKey = `${STORAGE_KEYS.POPULAR_MOVIES}_${page}`

    return from(this.isOnline()).pipe(
      mergeMap(async (isOnline) => {
        const cachedData = await this.getCachedData<MovieListResponse>(cacheKey)
        if (cachedData && !isOnline) {
          return cachedData
        }

        if (!isOnline) {
          const offlineData =
            await this.getOfflineData<MovieListResponse>(cacheKey)
          if (offlineData) {
            return offlineData
          }
          throw new Error('No internet connection and no cached data available')
        }

        try {
          const response = await this.axiosInstance.get<MovieListResponse>(
            API_ENDPOINTS.popular,
            { params: { page } },
          )

          await this.setCachedData(cacheKey, response.data)

          return response.data
        } catch (error) {
          const offlineData =
            await this.getOfflineData<MovieListResponse>(cacheKey)
          if (offlineData) {
            return offlineData
          }
          throw error
        }
      }),
      catchError((error) => throwError(() => error)),
    )
  }

  getMovieDetails(id: number): Observable<MovieDetails> {
    const cacheKey = `${STORAGE_KEYS.MOVIE_DETAILS}${id}`

    return from(this.isOnline()).pipe(
      mergeMap(async (isOnline) => {
        const cachedData = await this.getCachedData<MovieDetails>(cacheKey)
        if (cachedData && !isOnline) {
          return cachedData
        }

        if (!isOnline) {
          const offlineData = await this.getOfflineData<MovieDetails>(cacheKey)
          if (offlineData) {
            return offlineData
          }
          throw new Error('No internet connection and no cached data available')
        }

        try {
          const response = await this.axiosInstance.get<MovieDetails>(
            API_ENDPOINTS.movieDetails(id),
          )

          await this.setCachedData(cacheKey, response.data)

          return response.data
        } catch (error) {
          const offlineData = await this.getOfflineData<MovieDetails>(cacheKey)
          if (offlineData) {
            return offlineData
          }
          throw error
        }
      }),
      catchError((error) => throwError(() => error)),
    )
  }
}

export const apiService = new ApiService()
