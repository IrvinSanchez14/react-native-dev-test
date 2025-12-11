import React from 'react';
import { View } from 'react-native';
import { MetadataItem } from '../MetadataItem';
import { useTheme } from 'react-native-paper';
import { formatRelativeTime } from '../../../utils/dateHelpers';
import type { Article } from '../../../types/article';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './ArticleMetadata.styles';

export interface ArticleMetadataProps {
  article: Article;
  showComments?: boolean;
}

export function ArticleMetadata({ article, showComments = true }: ArticleMetadataProps) {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.container}>
      <View style={styles.metadataLeft}>
        {/* Points */}
        <MetadataItem
          icon="arrow-up"
          text={article.score}
          color={theme.custom.colors.primary}
        />

        {/* Author */}
        <MetadataItem
          icon="account"
          text={article.by}
        />

        {/* Time */}
        <MetadataItem
          icon="clock-outline"
          text={formatRelativeTime(article.time)}
        />

        {/* Comments */}
        {showComments && article.descendants !== undefined && article.descendants > 0 && (
          <MetadataItem
            icon="comment-outline"
            text={article.descendants}
          />
        )}
      </View>
    </View>
  );
}
