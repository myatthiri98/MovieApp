// Color palette for the entire app
export const COLORS = {
  // Primary colors
  primary: '#737EC8',
  primaryLight: '#99A2D1',
  primaryDark: '#49528E',

  // Background colors
  background: '#ffffff',
  backgroundSecondary: '#f8f8f8',
  backgroundGray: '#f0f0f0',

  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#ffffff',

  // Accent colors
  success: '#28a745',
  warning: '#ffc107',
  error: '#FF3B30',
  info: '#17a2b8',

  // Specific colors
  rating: '#FFD700',
  favorite: '#FE73BE',

  // Border colors
  border: '#e0e0e0',
  borderLight: '#f0f0f0',

  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Transparent
  transparent: 'transparent',
} as const

// Color variants for different states
export const COLOR_VARIANTS = {
  button: {
    primary: COLORS.primary,
    secondary: COLORS.backgroundGray,
    danger: COLORS.error,
    success: COLORS.success,
  },
  text: {
    primary: COLORS.textPrimary,
    secondary: COLORS.textSecondary,
    light: COLORS.textLight,
    white: COLORS.textWhite,
    error: COLORS.error,
  },
} as const
