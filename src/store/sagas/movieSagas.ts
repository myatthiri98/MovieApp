import {
  call,
  put,
  takeEvery,
  takeLatest,
  select,
  all,
} from 'redux-saga/effects'
import { firstValueFrom } from 'rxjs'
import { PayloadAction } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
} from '../actions/movieActions'
import { apiService } from '../../services/api'
import { Movie, MovieDetails, MovieListResponse, RootState } from '../../types'

// Worker Sagas
function* fetchUpcomingMoviesSaga(
  action: PayloadAction<{ page: number; refresh?: boolean }>,
) {
  try {
    const { page } = action.payload

    // Convert Observable to Promise for saga
    const response: MovieListResponse = yield call(() =>
      firstValueFrom(apiService.getUpcomingMovies(page)),
    )

    const hasMore = response.page < response.total_pages

    yield put(
      fetchUpcomingMoviesSuccess({
        movies: response.results,
        page: response.page,
        hasMore,
      }),
    )
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('fetchUpcomingMoviesSaga error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch upcoming movies'
    yield put(
      fetchUpcomingMoviesFailure({
        error: errorMessage,
      }),
    )
  }
}

function* fetchPopularMoviesSaga(
  action: PayloadAction<{ page: number; refresh?: boolean }>,
) {
  try {
    const { page } = action.payload

    // Convert Observable to Promise for saga
    const response: MovieListResponse = yield call(() =>
      firstValueFrom(apiService.getPopularMovies(page)),
    )

    const hasMore = response.page < response.total_pages

    yield put(
      fetchPopularMoviesSuccess({
        movies: response.results,
        page: response.page,
        hasMore,
      }),
    )
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch popular movies'
    yield put(
      fetchPopularMoviesFailure({
        error: errorMessage,
      }),
    )
  }
}

function* fetchMovieDetailsSaga(action: PayloadAction<{ movieId: number }>) {
  try {
    const { movieId } = action.payload

    // Convert Observable to Promise for saga
    const movieDetails: MovieDetails = yield call(() =>
      firstValueFrom(apiService.getMovieDetails(movieId)),
    )

    yield put(fetchMovieDetailsSuccess({ movieDetails }))
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch movie details'
    yield put(
      fetchMovieDetailsFailure({
        error: errorMessage,
        movieId: action.payload.movieId,
      }),
    )
  }
}

function* toggleFavoriteSaga(
  action: PayloadAction<{ movie: Movie }>,
): Generator<unknown, void, RootState> {
  try {
    // Get current favorites from state
    const state: RootState = yield select()
    const favorites = state.movies.favorites

    // Save to AsyncStorage
    yield call(AsyncStorage.setItem, 'favorites', JSON.stringify(favorites))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error saving favorites:', error)
  }
}

function* loadFavoritesSaga() {
  try {
    const favoritesJson: string | null = yield call(
      AsyncStorage.getItem,
      'favorites',
    )
    if (favoritesJson) {
      const favorites: Movie[] = JSON.parse(favoritesJson)
      yield put(loadFavoritesSuccess({ favorites }))
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading favorites:', error)
  }
}

// Watcher Sagas
function* watchFetchUpcomingMovies() {
  yield takeLatest(fetchUpcomingMoviesRequest.type, fetchUpcomingMoviesSaga)
}

function* watchFetchPopularMovies() {
  yield takeLatest(fetchPopularMoviesRequest.type, fetchPopularMoviesSaga)
}

function* watchFetchMovieDetails() {
  yield takeEvery(fetchMovieDetailsRequest.type, fetchMovieDetailsSaga)
}

function* watchToggleFavorite() {
  yield takeEvery(toggleFavorite.type, toggleFavoriteSaga)
}

function* watchLoadFavorites() {
  yield takeLatest(loadFavorites.type, loadFavoritesSaga)
}

// Root Saga
export function* movieSagas() {
  yield all([
    watchFetchUpcomingMovies(),
    watchFetchPopularMovies(),
    watchFetchMovieDetails(),
    watchToggleFavorite(),
    watchLoadFavorites(),
  ])
}
