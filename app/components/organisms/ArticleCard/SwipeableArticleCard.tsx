import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Card, CardContent, Text, IconButton } from '../../atoms';
import { SwipeableWrapper, MetadataItem, DomainChip } from '../../molecules';
import { formatRelativeTime } from '../../../utils/dateHelpers';
import type { MobileArticle } from '../../../types/mobile-article';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './SwipeableArticleCard.styles';

export interface SwipeableArticleCardProps {
  article: MobileArticle;
  onPress: () => void;
  onDelete: () => void;
  onToggleFavorite?: () => void;
  showDelete?: boolean;
}

function SwipeableArticleCardComponent({
  article,
  onPress,
  onDelete,
  onToggleFavorite,
  showDelete = true,
}: SwipeableArticleCardProps) {
  const theme = useTheme<AppTheme>();
  
  // Enhanced shadow for light mode to make cards more visible against white background
  const cardShadowStyle: ViewStyle = !theme.dark ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  } : {};

  return (
    <SwipeableWrapper onDelete={onDelete} showDelete={showDelete}>
      <Card style={[styles.card, cardShadowStyle]} mode="elevated">
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Article: ${article.title}`}
          accessibilityHint="Double tap to view article"
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <CardContent style={styles.content}>
            {onToggleFavorite && (
              <View style={styles.favoriteContainer}>
                <IconButton
                  icon={article.isFavorite ? 'star' : 'star-outline'}
                  size={20}
                  iconColor={article.isFavorite ? '#FFD700' : theme.custom.colors.textSecondary}
                  onPress={onToggleFavorite}
                  accessibilityLabel={article.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  accessibilityRole="button"
                />
              </View>
            )}
            <Text 
              variant="titleMedium" 
              style={styles.title} 
              numberOfLines={2}
            >
              {article.title}
            </Text>

            <View style={styles.metadata}>
              <MetadataItem
                icon="arrow-up"
                text={article.points}
                color={theme.custom.colors.primary}
              />
              <MetadataItem
                icon="comment-outline"
                text={article.numComments}
              />
              <MetadataItem
                icon="account"
                text={article.author}
              />
              <MetadataItem
                icon="clock-outline"
                text={formatRelativeTime(article.createdAt)}
              />
            </View>

            {article.url && (
              <Text
                variant="bodySmall"
                style={[styles.domain, { color: theme.custom.colors.textSecondary }]}
                numberOfLines={1}
              >
                {article.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
              </Text>
            )}
          </CardContent>
        </Pressable>
      </Card>
    </SwipeableWrapper>
  );
}


export const SwipeableArticleCard = React.memo(
  SwipeableArticleCardComponent,
  (prevProps, nextProps) => {
    // Only re-render if article id, favorite status, or delete visibility changes
    return (
      prevProps.article.id === nextProps.article.id &&
      prevProps.article.isFavorite === nextProps.article.isFavorite &&
      prevProps.showDelete === nextProps.showDelete
    );
  }
);
