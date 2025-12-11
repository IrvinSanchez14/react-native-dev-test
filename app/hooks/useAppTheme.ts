import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useUserPreferencesStore } from '../store/userPreferencesStore';
import { lightTheme, darkTheme } from '../theme/theme';

/**
 * Hook for managing app theme
 * Handles theme selection based on user preferences and system color scheme
 */
export function useAppTheme() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useUserPreferencesStore();

  const activeTheme = useMemo(() => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  const statusBarStyle = useMemo((): 'light' | 'dark' => {
    const effectiveTheme = themeMode === 'auto' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : themeMode;
    return effectiveTheme === 'dark' ? 'light' : 'dark';
  }, [themeMode, systemColorScheme]);

  return {
    activeTheme,
    statusBarStyle,
    themeMode,
  };
}
