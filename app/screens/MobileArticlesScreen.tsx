import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMobileArticles, useDeleteArticle, useToggleFavorite } from '../hooks/useMobileArticles';
import { SwipeableArticleCard, SwipeableArticleCardSkeleton } from '../components/organisms/ArticleCard';
import { EmptyState } from '../components/molecules';
import { ScreenHeader } from '../components/molecules';
import { MobileArticle } from '../types/mobile-article';
import type { AppTheme } from '../theme/theme';
import type { MobileArticlesScreenProps } from '../types/navigation';
import { styles } from './styles/MobileArticlesScreen.styles';

const SKELETON_COUNT = 5;

export function MobileArticlesScreen() {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<MobileArticlesScreenProps['navigation']>();
  const { data: articles = [], isLoading, refetch, isRefetching } = useMobileArticles();
  const deleteArticle = useDeleteArticle();
  const toggleFavorite = useToggleFavorite();

  const handleArticlePress = (article: MobileArticle) => {
    navigation.navigate('ArticleWebView', {
      url: article.url,
      title: article.title,
    });
  };

  const handleDeleteArticle = (article: MobileArticle) => {
    deleteArticle.mutate(article.id);
  };

  const handleToggleFavorite = (article: MobileArticle) => {
    toggleFavorite.mutate(article.id);
  };

  const renderSkeletonItem = () => <SwipeableArticleCardSkeleton />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Mobile Dev News" />

      {isLoading && articles.length === 0 ? (
        <FlatList
          data={Array.from({ length: SKELETON_COUNT })}
          keyExtractor={(_, index) => `skeleton-${index}`}
          renderItem={renderSkeletonItem}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : articles.length === 0 ? (
        <EmptyState
          icon="cellphone"
          title="No Articles"
          message="Pull down to load mobile development articles from Hacker News"
          actionLabel="Refresh"
          onAction={refetch}
        />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeableArticleCard
              article={item}
              onPress={() => handleArticlePress(item)}
              onDelete={() => handleDeleteArticle(item)}
              onToggleFavorite={() => handleToggleFavorite(item)}
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
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}
