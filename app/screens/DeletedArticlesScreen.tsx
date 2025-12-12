import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeletedArticles, useRestoreArticle } from '../hooks/useMobileArticles';
import { LoadingSpinner, EmptyState } from '../components/molecules';
import { ScreenHeader } from '../components/molecules';
import { Card, CardContent, Text, Button } from '../components/atoms';
import { MobileArticle } from '../types/mobile-article';
import { formatRelativeTime } from '../utils/dateHelpers';
import type { AppTheme } from '../theme/theme';
import type { DeletedArticlesScreenProps } from '../types/navigation';
import { styles } from './styles/DeletedArticlesScreen.styles';

export function DeletedArticlesScreen({ navigation }: DeletedArticlesScreenProps) {
  const theme = useTheme<AppTheme>();
  const { data: articles = [], isLoading, refetch, isRefetching } = useDeletedArticles();
  const restoreArticle = useRestoreArticle();

  const handleRestore = (article: MobileArticle) => {
    restoreArticle.mutate(article.id);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading deleted articles..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Deleted Articles" />

      {articles.length === 0 ? (
        <EmptyState
          icon="delete-empty"
          title="No Deleted Articles"
          message="Articles you delete will appear here"
        />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated">
              <CardContent>
                <Text variant="titleMedium" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.custom.colors.textSecondary, marginTop: 8 }}>
                  Deleted {formatRelativeTime(item.deletedAt || item.createdAt)}
                </Text>
                <Button
                  mode="contained"
                  icon="restore"
                  onPress={() => handleRestore(item)}
                  style={styles.restoreButton}
                >
                  Restore
                </Button>
              </CardContent>
            </Card>
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
