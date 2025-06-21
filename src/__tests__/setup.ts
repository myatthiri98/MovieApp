import { vi } from 'vitest'

vi.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}))

vi.mock('@react-native-community/netinfo', () => ({
  default: {
    fetch: vi.fn(() => Promise.resolve({ isConnected: true })),
    addEventListener: vi.fn(() => vi.fn()),
  },
}))

vi.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: vi.fn(),
    goBack: vi.fn(),
    setOptions: vi.fn(),
  }),
  useRoute: () => ({
    params: {
      movieId: 1,
      movie: {
        id: 1,
        title: 'Test Movie',
        overview: 'Test overview',
        poster_path: '/test.jpg',
        backdrop_path: '/test-backdrop.jpg',
        release_date: '2023-01-01',
        vote_average: 8.5,
        vote_count: 1000,
        isFavorite: false,
      },
    },
  }),
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
    children,
}))

vi.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}))

vi.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}))

vi.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('@env', () => ({
  TMDB_API_KEY: 'test-api-key-12345',
}))

global.fetch = vi.fn()

global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
}
