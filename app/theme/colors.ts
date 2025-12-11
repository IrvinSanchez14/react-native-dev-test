// Color palette for the app

export const colors = {
  // Primary (Hacker News orange)
  primary: '#FF6600',
  primaryDark: '#F0652F',
  primaryLight: '#FF7733',

  // Accent
  accent: '#FF6600',

  // Background
  background: '#FFFFFF',
  backgroundDark: '#1A1A1A',
  surface: '#FFFFFF',
  surfaceDark: '#2C2C2C',

  // Text
  text: '#000000',
  textDark: '#FFFFFF',
  textSecondary: '#666666',
  textSecondaryDark: '#AAAAAA',
  textDisabled: '#999999',

  // Status colors
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',

  // Article interaction
  saved: '#4CAF50',
  favorite: '#FFD700',
  read: '#9E9E9E',
  unread: '#2196F3',

  // UI elements
  border: '#E0E0E0',
  borderDark: '#404040',
  divider: '#E0E0E0',
  dividerDark: '#404040',
  ripple: 'rgba(255, 102, 0, 0.12)',

  // Swipe actions
  swipeDelete: '#F44336',
  swipeSave: '#4CAF50',
  swipeFavorite: '#FFD700',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Notification
  notification: '#FF6600',
  notificationBackground: '#FFF3E0',
  notificationBackgroundDark: '#4A3520',
} as const;

// Light theme colors
export const lightColors = {
  primary: colors.primary,
  background: colors.background,
  surface: colors.surface,
  text: colors.text,
  textSecondary: colors.textSecondary,
  border: colors.border,
  divider: colors.divider,
  error: colors.error,
  success: colors.success,
  warning: colors.warning,
  info: colors.info,
  notification: colors.notification,
};

// Dark theme colors
export const darkColors = {
  primary: colors.primary,
  background: colors.backgroundDark,
  surface: colors.surfaceDark,
  text: colors.textDark,
  textSecondary: colors.textSecondaryDark,
  border: colors.borderDark,
  divider: colors.dividerDark,
  error: colors.error,
  success: colors.success,
  warning: colors.warning,
  info: colors.info,
  notification: colors.notification,
};
