import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAskStories, useArticleActions } from '../hooks/useArticles';
import { ScreenHeader } from '../components/molecules';
import { ArticleList } from '../components/organisms';
import { Article } from '../types/article';
import type { AskHNListScreenProps } from '../types/navigation';
import { styles } from './styles/AskHNScreen.styles';

export function AskHNScreen({ navigation }: AskHNListScreenProps) {
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAskStories();
  const { saveArticle, unsaveArticle, favoriteArticle, unfavoriteArticle, markAsRead } =
    useArticleActions();

  const articles = React.useMemo(
    () => data?.pages.flatMap((page) => page.articles) ?? [],
    [data]
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Ask HN" />

      <ArticleList
        articles={articles}
        isLoading={isLoading}
        isRefreshing={isRefetching}
        onRefresh={refetch}
        onArticlePress={handleArticlePress}
        onSaveArticle={handleSaveArticle}
        onFavoriteArticle={handleFavoriteArticle}
        onEndReached={handleEndReached}
        emptyTitle="No Ask HN Posts"
        emptyMessage="Pull down to load questions from the community"
        emptyIcon="help-circle"
      />
    </SafeAreaView>
  );
}
