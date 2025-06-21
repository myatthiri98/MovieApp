export const SCREEN_NAMES = {
  MovieList: 'MovieList',
  MovieDetails: 'MovieDetails',
} as const

export const NAVIGATION_CONFIG = {
  gestureEnabled: true,
  headerBackTitle: '',

  header: {
    backgroundColor: '#007AFF',
    tintColor: '#ffffff',
    titleStyle: {
      fontWeight: 'bold',
    },
  },

  screens: {
    movieList: {
      headerShown: false,
    },
    movieDetails: {
      headerShown: true,
      gestureEnabled: true,
    },
  },

  tabs: {
    initialTab: 'upcoming' as const,
  },
} as const

export type NavigationParams = {
  [SCREEN_NAMES.MovieList]: undefined
  [SCREEN_NAMES.MovieDetails]: {
    movieId: number
    movie?: any
  }
}

export const DEEP_LINKING = {
  prefixes: ['movieapp://'],
  config: {
    screens: {
      [SCREEN_NAMES.MovieList]: 'movies',
      [SCREEN_NAMES.MovieDetails]: 'movie/:movieId',
    },
  },
} as const
