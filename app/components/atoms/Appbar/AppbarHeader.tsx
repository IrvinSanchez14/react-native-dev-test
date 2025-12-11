import React from 'react';
import { Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import type { AppbarHeaderProps as PaperAppbarHeaderProps } from 'react-native-paper';

export type AppbarHeaderProps = Omit<PaperAppbarHeaderProps, 'elevated' | 'statusBarHeight'> & {
  elevated?: boolean;
  statusBarHeight?: number;
};

export function AppbarHeader({ elevated = true, statusBarHeight, ...props }: AppbarHeaderProps) {
  const computedStatusBarHeight = statusBarHeight !== undefined 
    ? statusBarHeight 
    : Platform.OS === 'android' 
      ? 0 
      : undefined;

  return (
    <Appbar.Header 
      elevated={elevated}
      statusBarHeight={computedStatusBarHeight}
      {...props} 
    />
  );
}
