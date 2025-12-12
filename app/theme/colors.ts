export const colors = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  primaryLight: '#42A5F5',

  accent: '#1976D2',

  background: '#FFFFFF',
  backgroundDark: '#000000',
  surface: '#FFFFFF',
  surfaceDark: '#2C2C2C',

  text: '#000000',
  textDark: '#FFFFFF',
  textSecondary: '#666666',
  textSecondaryDark: '#AAAAAA',
  textDisabled: '#999999',

  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',

  saved: '#4CAF50',
  favorite: '#FFD700',
  read: '#9E9E9E',
  unread: '#2196F3',

  border: '#E0E0E0',
  borderDark: '#404040',
  divider: '#E0E0E0',
  dividerDark: '#404040',
  ripple: 'rgba(25, 118, 210, 0.12)',

  swipeDelete: '#F44336',
  swipeSave: '#4CAF50',
  swipeFavorite: '#FFD700',

  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  notification: '#1976D2',
  notificationBackground: '#E3F2FD',
  notificationBackgroundDark: '#0D47A1',
} as const;

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
