import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import type { ActivityIndicatorProps } from 'react-native-paper';

export interface SpinnerProps extends ActivityIndicatorProps {
  // Add custom props if needed in the future
}

export function Spinner({ ...props }: SpinnerProps) {
  return <ActivityIndicator {...props} />;
}
