import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTopStories, useArticleActions } from '../hooks/useArticles';
import { ScreenHeader } from '../components/molecules';
import { ArticleList } from '../components/organisms';
import { Article } from '../types/article';
import type { TopStoriesListScreenProps } from '../types/navigation';

export function TopStoriesScreen({ navigation }: TopStoriesListScreenProps) {
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTopStories();
  const { saveArticle, unsaveArticle, favoriteArticle, unfavoriteArticle, markAsRead } =
    useArticleActions();

  // Flatten pages into a single array
  const articles = React.useMemo(
    () => data?.pages.flatMap((page) => page.articles) ?? [],
    [data]
  );

  const handleArticlePress = async (article: Article) => {
    // Mark as read when opening
    await markAsRead.mutateAsync(article.id);

    // Navigate to article detail
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Top Stories" />

      <ArticleList
        articles={articles}
        isLoading={isLoading}
        isRefreshing={isRefetching}
        onRefresh={refetch}
        onArticlePress={handleArticlePress}
        onSaveArticle={handleSaveArticle}
        onFavoriteArticle={handleFavoriteArticle}
        onEndReached={handleEndReached}
        emptyTitle="No Top Stories"
        emptyMessage="Pull down to load the latest stories from Hacker News"
        emptyIcon="fire"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
