import { all, fork } from 'redux-saga/effects'
import { movieSagas } from '@/store/sagas/movieSagas'

export function* rootSaga() {
  yield all([fork(movieSagas)])
}
