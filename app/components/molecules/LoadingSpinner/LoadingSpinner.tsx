import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner, Text } from '../../atoms';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});
