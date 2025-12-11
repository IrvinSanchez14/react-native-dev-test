import React from 'react';
import { View } from 'react-native';
import { Chip } from '../../atoms';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './ArticleStatusChips.styles';

export interface ArticleStatusChipsProps {
  isRead?: boolean;
  isSaved?: boolean;
  isFavorite?: boolean;
}

export function ArticleStatusChips({ isRead, isSaved, isFavorite }: ArticleStatusChipsProps) {
  const theme = useTheme<AppTheme>();


  if (!isRead && !isSaved && !isFavorite) {
    return null;
  }

  return (
    <View style={styles.container}>
      {isRead && (
        <Chip
          mode="flat"
          compact
          style={[styles.chip, { backgroundColor: theme.custom.colors.read + '20' }]}
          textStyle={styles.text}
          icon="eye-check"
        >
          Read
        </Chip>
      )}
      {isSaved && (
        <Chip
          mode="flat"
          compact
          style={[styles.chip, { backgroundColor: theme.custom.colors.saved + '20' }]}
          textStyle={styles.text}
          icon="bookmark"
        >
          Saved
        </Chip>
      )}
      {isFavorite && (
        <Chip
          mode="flat"
          compact
          style={[styles.chip, { backgroundColor: theme.custom.colors.favorite + '20' }]}
          textStyle={styles.text}
          icon="star"
        >
          Favorite
        </Chip>
      )}
    </View>
  );
}
