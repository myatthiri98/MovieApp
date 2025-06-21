import { combineReducers } from '@reduxjs/toolkit'
import { movieReducer } from '@/store/reducers/movieReducer'
import { networkReducer } from '@/store/reducers/networkReducer'

export const rootReducer = combineReducers({
  movies: movieReducer,
  network: networkReducer,
})
