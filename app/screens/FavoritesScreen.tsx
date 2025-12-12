import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoriteArticles, useToggleFavorite } from '../hooks/useMobileArticles';
import { SwipeableArticleCard } from '../components/organisms/ArticleCard/SwipeableArticleCard';
import { LoadingSpinner, EmptyState } from '../components/molecules';
import { ScreenHeader } from '../components/molecules';
import { MobileArticle } from '../types/mobile-article';
import type { AppTheme } from '../theme/theme';
import type { FavoritesScreenProps } from '../types/navigation';
import { styles } from './styles/FavoritesScreen.styles';

export function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const theme = useTheme<AppTheme>();
  const { data: articles = [], isLoading, refetch, isRefetching } = useFavoriteArticles();
  const toggleFavorite = useToggleFavorite();

  const handleArticlePress = (article: MobileArticle) => {
    navigation.navigate('ArticleWebView', {
      url: article.url,
      title: article.title,
    });
  };

  const handleToggleFavorite = (article: MobileArticle) => {
    toggleFavorite.mutate(article.id);
  };

  if (isLoading && articles.length === 0) {
    return <LoadingSpinner message="Loading favorites..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Favorites" />

      {articles.length === 0 ? (
        <EmptyState
          icon="star-outline"
          title="No Favorites"
          message="Star articles to add them to your favorites"
        />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeableArticleCard
              article={item}
              onPress={() => handleArticlePress(item)}
              onDelete={() => {}}
              onToggleFavorite={() => handleToggleFavorite(item)}
              showDelete={false}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}
