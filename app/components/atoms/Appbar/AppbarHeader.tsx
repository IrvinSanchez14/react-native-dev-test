import React from 'react';
import { Appbar } from 'react-native-paper';
import type { AppbarHeaderProps as PaperAppbarHeaderProps } from 'react-native-paper';

export interface AppbarHeaderProps extends PaperAppbarHeaderProps {
  // Add custom props if needed in the future
}

export function AppbarHeader({ ...props }: AppbarHeaderProps) {
  return <Appbar.Header {...props} />;
}
