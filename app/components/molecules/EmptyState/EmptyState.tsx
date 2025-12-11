import React from 'react';
import { View } from 'react-native';
import { Icon, Text, Button } from '../../atoms';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './EmptyState.styles';

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
