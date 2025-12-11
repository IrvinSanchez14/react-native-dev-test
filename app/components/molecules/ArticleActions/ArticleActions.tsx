import React from 'react';
import { View, Linking } from 'react-native';
import { IconButton } from '../../atoms';
import { useTheme } from 'react-native-paper';
import type { Article } from '../../../types/article';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './ArticleActions.styles';

export interface ArticleActionsProps {
  article: Article;
  onSave?: () => void;
  onFavorite?: () => void;
  onExternal?: () => void;
}

export function ArticleActions({ article, onSave, onFavorite, onExternal }: ArticleActionsProps) {
  const theme = useTheme<AppTheme>();

  const handleExternalLink = () => {
    if (onExternal) {
      onExternal();
    } else if (article.url) {
      Linking.openURL(article.url);
    }
  };

  return (
    <View style={styles.container}>
      {onSave && (
        <IconButton
          icon={article.isSaved ? 'bookmark' : 'bookmark-outline'}
          size={20}
          iconColor={
            article.isSaved ? theme.custom.colors.saved : theme.custom.colors.textSecondary
          }
          onPress={onSave}
          accessibilityLabel={article.isSaved ? 'Remove bookmark' : 'Bookmark article'}
          accessibilityRole="button"
        />
      )}
      {onFavorite && (
        <IconButton
          icon={article.isFavorite ? 'star' : 'star-outline'}
          size={20}
          iconColor={
            article.isFavorite
              ? theme.custom.colors.favorite
              : theme.custom.colors.textSecondary
          }
          onPress={onFavorite}
          accessibilityLabel={article.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          accessibilityRole="button"
        />
      )}
      {article.url && (
        <IconButton
          icon="open-in-new"
          size={20}
          iconColor={theme.custom.colors.textSecondary}
          onPress={handleExternalLink}
          accessibilityLabel="Open article in browser"
          accessibilityRole="button"
        />
      )}
    </View>
  );
}
