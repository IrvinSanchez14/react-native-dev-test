import React from 'react';
import { ScrollView, Linking, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useArticle, useArticleActions } from '../hooks/useArticles';
import { LoadingSpinner, EmptyState } from '../components/molecules';
import { ScreenHeader } from '../components/molecules';
import { Text, Button, Chip, Divider, Icon } from '../components/atoms';
import { formatRelativeTime, formatFullDate } from '../utils/dateHelpers';
import type { ArticleDetailScreenProps } from '../types/navigation';
import type { AppTheme } from '../theme/theme';
import { styles } from './styles/ArticleDetailScreen.styles';

export function ArticleDetailScreen({ route, navigation }: ArticleDetailScreenProps) {
  const { articleId } = route.params;
  const theme = useTheme<AppTheme>();

  const { data: article, isLoading } = useArticle(articleId);
  const { saveArticle, unsaveArticle, favoriteArticle, unfavoriteArticle, markAsUnread } =
    useArticleActions();

  if (isLoading) {
    return <LoadingSpinner message="Loading article..." />;
  }

  if (!article) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="Article"
          showBack
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="alert-circle"
          title="Article Not Found"
          message="This article could not be loaded"
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const handleOpenUrl = () => {
    if (article.url) {
      Linking.openURL(article.url);
    }
  };

  const handleToggleSave = () => {
    if (article.isSaved) {
      unsaveArticle.mutate(article.id);
    } else {
      saveArticle.mutate(article.id);
    }
  };

  const handleToggleFavorite = () => {
    if (article.isFavorite) {
      unfavoriteArticle.mutate(article.id);
    } else {
      favoriteArticle.mutate(article.id);
    }
  };

  const handleMarkUnread = () => {
    markAsUnread.mutate(article.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Article"
        showBack
        onBack={() => navigation.goBack()}
        actions={[
          {
            icon: article.isSaved ? 'bookmark' : 'bookmark-outline',
            onPress: handleToggleSave,
            accessibilityLabel: article.isSaved ? 'Unsave' : 'Save',
          },
          {
            icon: article.isFavorite ? 'star' : 'star-outline',
            onPress: handleToggleFavorite,
            accessibilityLabel: article.isFavorite ? 'Unfavorite' : 'Favorite',
          }
        ]}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          {article.title}
        </Text>

        <View style={styles.metadata}>
          <View style={styles.metadataRow}>
            <Icon
              name="account"
              size={16}
              color={theme.custom.colors.textSecondary}
              style={styles.icon}
            />
            <Text variant="bodyMedium" style={{ color: theme.custom.colors.textSecondary }}>
              {article.by}
            </Text>
          </View>

          <View style={styles.metadataRow}>
            <Icon
              name="clock-outline"
              size={16}
              color={theme.custom.colors.textSecondary}
              style={styles.icon}
            />
            <Text variant="bodyMedium" style={{ color: theme.custom.colors.textSecondary }}>
              {formatRelativeTime(article.time)}
            </Text>
          </View>

          <View style={styles.metadataRow}>
            <Icon
              name="calendar"
              size={16}
              color={theme.custom.colors.textSecondary}
              style={styles.icon}
            />
            <Text variant="bodyMedium" style={{ color: theme.custom.colors.textSecondary }}>
              {formatFullDate(article.time)}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <Chip icon="arrow-up" style={styles.statChip}>
            {article.score} points
          </Chip>
          {article.descendants !== undefined && article.descendants > 0 && (
            <Chip icon="comment-outline" style={styles.statChip}>
              {article.descendants} comments
            </Chip>
          )}
          <Chip icon={`eye${article.isRead ? '-check' : '-outline'}`} style={styles.statChip}>
            {article.isRead ? 'Read' : 'Unread'}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        {article.text && (
          <View style={styles.textContainer}>
            <Text
              variant="bodyLarge"
              style={[styles.text, { color: theme.colors.onBackground }]}
            >
              {article.text.replace(/<[^>]*>/g, '')}
            </Text>
          </View>
        )}

        {article.url && (
          <Button
            mode="contained"
            icon="open-in-new"
            onPress={handleOpenUrl}
            style={styles.urlButton}
          >
            Open External Link
          </Button>
        )}

        <View style={styles.actions}>
          {article.isRead && (
            <Button mode="outlined" icon="eye-off" onPress={handleMarkUnread} style={styles.actionButton}>
              Mark as Unread
            </Button>
          )}
        </View>

        <View style={styles.footer}>
          <Chip mode="outlined" compact>
            Type: {article.type}
          </Chip>
          <Chip mode="outlined" compact>
            ID: {article.id}
          </Chip>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
