import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import type { ActivityIndicatorProps } from 'react-native-paper';

export interface SpinnerProps extends ActivityIndicatorProps {

}

export function Spinner({ ...props }: SpinnerProps) {
  return <ActivityIndicator {...props} />;
}
