import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Text } from '../../atoms';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../../../theme/theme';

export interface MetadataItemProps {
  icon: string;
  text: string | number;
  color?: string;
}

export function MetadataItem({ icon, text, color }: MetadataItemProps) {
  const theme = useTheme<AppTheme>();
  const iconColor = color || theme.custom.colors.textSecondary;

  return (
    <View style={styles.container}>
      <Icon
        name={icon}
        size={14}
        color={iconColor}
        style={styles.icon}
      />
      <Text variant="bodySmall" style={{ color: theme.custom.colors.textSecondary }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  icon: {
    marginRight: 4,
  },
});
