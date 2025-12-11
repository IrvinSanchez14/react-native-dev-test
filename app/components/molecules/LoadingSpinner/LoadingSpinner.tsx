import React from 'react';
import { View } from 'react-native';
import { Spinner, Text } from '../../atoms';
import { styles } from './LoadingSpinner.styles';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large' | number;
}

export function LoadingSpinner({ message, size = 'large' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <Spinner size={size} />
      {message && (
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
}
