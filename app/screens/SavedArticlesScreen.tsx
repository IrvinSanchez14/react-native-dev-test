import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSavedArticles, useFavoriteArticles, useArticleActions } from '../hooks/useArticles';
import { ScreenHeader } from '../components/molecules';
import { ArticleList } from '../components/organisms';
import { SegmentedButtons } from '../components/atoms';
import { Article } from '../types/article';
import type { SavedListScreenProps } from '../types/navigation';

type TabType = 'saved' | 'favorites';

export function SavedArticlesScreen({ navigation }: SavedListScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('saved');

  const { data: savedArticles = [], isLoading: isSavedLoading, refetch: refetchSaved } = useSavedArticles();
  const { data: favoriteArticles = [], isLoading: isFavoritesLoading, refetch: refetchFavorites } = useFavoriteArticles();
  const { saveArticle, unsaveArticle, favoriteArticle, unfavoriteArticle, markAsRead, deleteArticle } = useArticleActions();

  const currentArticles = activeTab === 'saved' ? savedArticles : favoriteArticles;
  const isLoading = activeTab === 'saved' ? isSavedLoading : isFavoritesLoading;
  const refetch = activeTab === 'saved' ? refetchSaved : refetchFavorites;

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

  const handleDeleteArticle = async (article: Article) => {
    await deleteArticle.mutateAsync(article.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Saved"
        actions={[
          {
            icon: 'cog',
            onPress: () => navigation.navigate('Settings'),
            accessibilityLabel: 'Settings',
          }
        ]}
      />

      {/* Segmented Buttons for Tab Selection */}
      <View style={styles.segmentedContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          buttons={[
            {
              value: 'saved',
              label: `Bookmarks (${savedArticles.length})`,
              icon: 'bookmark',
            },
            {
              value: 'favorites',
              label: `Favorites (${favoriteArticles.length})`,
              icon: 'star',
            },
          ]}
        />
      </View>

      <ArticleList
        articles={currentArticles}
        isLoading={isLoading}
        onRefresh={refetch}
        onArticlePress={handleArticlePress}
        onSaveArticle={handleSaveArticle}
        onFavoriteArticle={handleFavoriteArticle}
        emptyTitle={activeTab === 'saved' ? 'No Saved Articles' : 'No Favorite Articles'}
        emptyMessage={
          activeTab === 'saved'
            ? 'Articles you bookmark will appear here'
            : 'Articles you favorite will appear here'
        }
        emptyIcon={activeTab === 'saved' ? 'bookmark-outline' : 'star-outline'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedContainer: {
    padding: 16,
    paddingBottom: 8,
  },
});
