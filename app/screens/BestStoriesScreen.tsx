import React from 'react';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { InfiniteData } from '@tanstack/react-query';
import { useBestStories, useArticleActions } from '../hooks/useArticles';
import { ScreenHeader } from '../components/molecules';
import { ArticleList } from '../components/organisms';
import { Article } from '../types/article';
import type { AppTheme } from '../theme/theme';
import type { BestStoriesListScreenProps } from '../types/navigation';
import type { FeedPageResult } from '../hooks/useFeedFactory';
import { styles } from './styles/BestStoriesScreen.styles';

export function BestStoriesScreen({ navigation }: BestStoriesListScreenProps) {
  const theme = useTheme<AppTheme>();
  const queryResult = useBestStories();
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = queryResult;
  const { saveArticle, unsaveArticle, favoriteArticle, unfavoriteArticle, markAsRead } =
    useArticleActions();

  const infiniteData = data as InfiniteData<FeedPageResult> | undefined;
  const articles = React.useMemo(
    () => infiniteData?.pages.flatMap((page: FeedPageResult) => page.articles) ?? [],
    [infiniteData]
  );

  const handleArticlePress = async (article: Article) => {
    await markAsRead.mutateAsync(article.id);
    navigation.navigate('ArticleDetail', { articleId: article.id });
  };

  const handleSaveArticle = async (article: Article) => {
    if (article.isSaved) {
      await unsaveArticle.mutateAsync(article.id);
    } else {
      await saveArticle.mutateAsync(article.id);
    }
  };

  const handleFavoriteArticle = async (article: Article) => {
    if (article.isFavorite) {
      await unfavoriteArticle.mutateAsync(article.id);
    } else {
      await favoriteArticle.mutateAsync(article.id);
    }
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Best Stories" />

      <ArticleList
        articles={articles}
        isLoading={isLoading}
        isRefreshing={isRefetching}
        onRefresh={refetch}
        onArticlePress={handleArticlePress}
        onSaveArticle={handleSaveArticle}
        onFavoriteArticle={handleFavoriteArticle}
        onEndReached={handleEndReached}
        emptyTitle="No Best Stories"
        emptyMessage="Pull down to load the highest rated stories"
        emptyIcon="star"
      />
    </SafeAreaView>
  );
}
