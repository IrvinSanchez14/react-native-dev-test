import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { colors, lightColors, darkColors } from './colors';

// Extend the theme type to include custom properties
export type AppTheme = MD3Theme & {
  custom: {
    colors: typeof colors;
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    shadows: typeof shadows;
  };
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border radius scale
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Shadow definitions
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
} as const;

// Light theme
export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.accent,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: colors.text,
    onSurface: colors.text,
    outline: colors.border,
    surfaceVariant: '#F5F5F5',
    onSurfaceVariant: colors.textSecondary,
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F9F9F9',
      level3: '#F5F5F5',
      level4: '#F2F2F2',
      level5: '#F0F0F0',
    },
  },
  custom: {
    colors,
    spacing,
    borderRadius,
    shadows,
  },
};

// Dark theme
export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryDark,
    secondary: colors.accent,
    background: colors.backgroundDark,
    surface: colors.surfaceDark,
    error: colors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: colors.textDark,
    onSurface: colors.textDark,
    outline: colors.borderDark,
    surfaceVariant: '#3C3C3C',
    onSurfaceVariant: colors.textSecondaryDark,
    elevation: {
      level0: 'transparent',
      level1: '#2C2C2C',
      level2: '#333333',
      level3: '#3A3A3A',
      level4: '#404040',
      level5: '#464646',
    },
  },
  custom: {
    colors,
    spacing,
    borderRadius,
    shadows,
  },
};

// Helper function to get theme based on mode
export function getTheme(mode: 'light' | 'dark'): AppTheme {
  return mode === 'light' ? lightTheme : darkTheme;
}
