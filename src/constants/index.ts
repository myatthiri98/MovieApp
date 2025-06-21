import { COLORS, COLOR_VARIANTS } from './colors'
import {
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  DIMENSIONS,
  ANIMATION,
} from './dimensions'
import { STRINGS } from './strings'

export * from './colors'
export * from './dimensions'
export * from './strings'
export * from './navigation'

export const THEME = {
  colors: COLORS,
  colorVariants: COLOR_VARIANTS,
  spacing: SPACING,
  fontSizes: FONT_SIZES,
  fontWeights: FONT_WEIGHTS,
  borderRadius: BORDER_RADIUS,
  dimensions: DIMENSIONS,
  animation: ANIMATION,
  strings: STRINGS,
} as const

export type Theme = typeof THEME
export type Colors = typeof COLORS
export type Spacing = typeof SPACING
export type FontSizes = typeof FONT_SIZES

export const getSpacing = (size: keyof typeof SPACING) => SPACING[size]
export const getColor = (color: keyof typeof COLORS) => COLORS[color]
export const getFontSize = (size: keyof typeof FONT_SIZES) => FONT_SIZES[size]
