import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Text, Button } from '../../atoms';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../../../theme/theme';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.container}>
      {icon && (
        <Icon
          name={icon}
          size={64}
          color={theme.custom.colors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
        {title}
      </Text>
      {message && (
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.custom.colors.textSecondary }]}
        >
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
});
