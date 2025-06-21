import { Dimensions } from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Spacing system (based on 4px grid)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
} as const

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  giant: 32,
} as const

export const FONT_WEIGHTS = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const

export const BORDER_RADIUS = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  xxxl: 20,
  round: 25,
  circle: 50,
} as const

export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} as const

export const DIMENSIONS = {
  headerHeight: 60,

  movieCard: {
    width: (SCREEN_WIDTH - 48) / 2, // 2 columns with padding
    aspectRatio: 1.5, // height = width * 1.5
  },

  poster: {
    small: { width: 80, height: 120 },
    medium: { width: 120, height: 180 },
    large: { width: 160, height: 240 },
  },

  backdrop: {
    height: 250,
    overlap: 50,
  },

  button: {
    height: 44,
    minWidth: 88,
  },

  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },

  tab: {
    height: 48,
  },
} as const

export const Z_INDEX = {
  background: 0,
  content: 1,
  overlay: 10,
  modal: 100,
  tooltip: 1000,
} as const

export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

export const PAGINATION = {
  pageSize: 20,
  endReachedThreshold: 0.3,
  cacheDuration: 5 * 60 * 1000,
} as const
