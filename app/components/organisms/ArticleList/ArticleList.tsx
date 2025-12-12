import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ArticleCard, ArticleCardSkeleton } from '../ArticleCard';
import { EmptyState } from '../../molecules';
import type { Article } from '../../../types/article';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './ArticleList.styles';

const SKELETON_COUNT = 5;

export interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onArticlePress: (article: Article) => void;
  onSaveArticle?: (article: Article) => void;
  onFavoriteArticle?: (article: Article) => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: string;
  showActions?: boolean;
  ListHeaderComponent?: React.ComponentType<unknown> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<unknown> | React.ReactElement | null;
}

export function ArticleList({
  articles,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  onArticlePress,
  onSaveArticle,
  onFavoriteArticle,
  onEndReached,
  onEndReachedThreshold = 0.5,
  emptyTitle = 'No Articles',
  emptyMessage = 'Pull down to refresh',
  emptyIcon = 'text-box-outline',
  showActions = true,
  ListHeaderComponent,
  ListFooterComponent,
}: ArticleListProps) {
  const theme = useTheme<AppTheme>();


  const keyExtractor = useCallback((item: Article) => item.id.toString(), []);


  const renderItem = useCallback(
    ({ item }: { item: Article }) => (
      <ArticleCard
        article={item}
        onPress={() => onArticlePress(item)}
        onSave={onSaveArticle ? () => onSaveArticle(item) : undefined}
        onFavorite={onFavoriteArticle ? () => onFavoriteArticle(item) : undefined}
        showActions={showActions}
      />
    ),
    [onArticlePress, onSaveArticle, onFavoriteArticle, showActions]
  );

  const renderSkeletonItem = useCallback(() => <ArticleCardSkeleton />, []);

  if (isLoading && articles.length === 0) {
    return (
      <FlatList
        data={Array.from({ length: SKELETON_COUNT })}
        keyExtractor={(_, index) => `skeleton-${index}`}
        renderItem={renderSkeletonItem}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={false}
      />
    );
  }


  if (!isLoading && articles.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={onRefresh ? 'Refresh' : undefined}
        onAction={onRefresh}
      />
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      contentContainerStyle={[
        styles.contentContainer,
        articles.length === 0 && styles.emptyContainer,
      ]}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
    />
  );
}
