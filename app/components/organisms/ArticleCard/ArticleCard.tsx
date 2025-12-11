import React from 'react';
import { Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Card, CardContent, Text } from '../../atoms';
import {
  ArticleMetadata,
  ArticleStatusChips,
  ArticleActions,
  DomainChip,
} from '../../molecules';
import type { Article } from '../../../types/article';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './ArticleCard.styles';

export interface ArticleCardProps {
  article: Article;
  onPress: () => void;
  onSave?: () => void;
  onFavorite?: () => void;
  showActions?: boolean;
}

function ArticleCardComponent({
  article,
  onPress,
  onSave,
  onFavorite,
  showActions = true,
}: ArticleCardProps) {
  const theme = useTheme<AppTheme>();

  return (
    <Card style={styles.card} mode="elevated">
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Article: ${article.title}`}
        accessibilityHint="Double tap to view article details"
      >
        <CardContent style={styles.content}>
          {/* Article Title */}
          <Text
            variant="titleMedium"
            style={[
              styles.title,
              { color: theme.colors.onSurface },
              article.isRead && { color: theme.custom.colors.textSecondary },
            ]}
            numberOfLines={3}
          >
            {article.title}
          </Text>

          {/* Metadata (points, author, time, comments) */}
          <ArticleMetadata article={article} />

          {/* Domain Chip */}
          {article.url && <DomainChip url={article.url} />}

          {/* Status Chips (Read, Saved, Favorite) */}
          <ArticleStatusChips
            isRead={article.isRead}
            isSaved={article.isSaved}
            isFavorite={article.isFavorite}
          />

          {/* Action Buttons */}
          {showActions && (
            <ArticleActions
              article={article}
              onSave={onSave}
              onFavorite={onFavorite}
            />
          )}
        </CardContent>
      </Pressable>
    </Card>
  );
}


export const ArticleCard = React.memo(ArticleCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.article.id === nextProps.article.id &&
    prevProps.article.isRead === nextProps.article.isRead &&
    prevProps.article.isSaved === nextProps.article.isSaved &&
    prevProps.article.isFavorite === nextProps.article.isFavorite &&
    prevProps.showActions === nextProps.showActions
  );
});
