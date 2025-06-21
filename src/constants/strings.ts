// Application strings - centralized for easy localization and maintenance
export const STRINGS = {
  // App general
  app: {
    name: 'Movie App',
    welcomeTitle: 'Welcome to the Movie App',
  },

  // Tabs
  tabs: {
    upcoming: 'Upcoming',
    popular: 'Popular',
  },

  // Loading states
  loading: {
    default: 'Loading...',
    loadingMore: 'Loading more...',
  },

  // Error messages
  errors: {
    networkError: 'Network error occurred',
    noInternet: 'No internet connection',
    failedToFetch: 'Failed to fetch data',
    somethingWentWrong: 'Something went wrong',
    noData: 'No data available',
  },

  // Movie related
  movies: {
    noUpcomingMovies: 'No upcoming movies found',
    noPopularMovies: 'No popular movies found',
    movieDetails: 'Movie Details',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    overview: 'Overview',
    budget: 'Budget',
    revenue: 'Revenue',
    productionCompanies: 'Production Companies',
    runtime: 'Runtime',
    releaseDate: 'Release Date',
    rating: 'Rating',
    votes: 'votes',
    genres: 'Genres',
  },

  // Actions
  actions: {
    retry: 'Retry',
    refresh: 'Refresh',
    cancel: 'Cancel',
    ok: 'OK',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    close: 'Close',
    search: 'Search',
  },

  // Units
  units: {
    minutes: 'min',
    hours: 'hours',
    days: 'days',
    currency: '$',
  },

  // Accessibility labels
  accessibility: {
    movieCard: 'Movie card',
    favoriteButton: 'Toggle favorite',
    retryButton: 'Retry loading',
    backButton: 'Go back',
    searchButton: 'Search movies',
    tabButton: 'Switch tab',
  },

  empty: {
    noMovies: (type: string) => `No ${type} movies found`,
    noFavorites: 'No favorite movies yet',
    noResults: 'No search results',
  },

  success: {
    addedToFavorites: 'Added to favorites',
    removedFromFavorites: 'Removed from favorites',
    dataRefreshed: 'Data refreshed successfully',
  },
} as const

export const formatString = {
  votes: (count: number) => `(${count} ${STRINGS.movies.votes})`,
  runtime: (minutes: number) => `${minutes} ${STRINGS.units.minutes}`,
  currency: (amount: number) =>
    `${STRINGS.units.currency}${amount.toLocaleString()}`,
  year: (date: string) => new Date(date).getFullYear().toString(),
  emptyMovies: (type: 'upcoming' | 'popular') => STRINGS.empty.noMovies(type),
} as const
