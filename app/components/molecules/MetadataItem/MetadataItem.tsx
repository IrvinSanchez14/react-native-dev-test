import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Icon, Text } from '../../atoms';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './MetadataItem.styles';

export interface MetadataItemProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  text: string | number;
  color?: string;
}

export function MetadataItem(props: MetadataItemProps) {
  const { icon, text, color } = props;
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
