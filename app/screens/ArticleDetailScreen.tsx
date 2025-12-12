import React, { useCallback, useMemo } from 'react';
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

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenUrl = useCallback(() => {
    if (article?.url) {
      Linking.openURL(article.url);
    }
  }, [article?.url]);

  const handleToggleSave = useCallback(() => {
    if (!article) return;
    if (article.isSaved) {
      unsaveArticle.mutate(article.id);
    } else {
      saveArticle.mutate(article.id);
    }
  }, [article, saveArticle, unsaveArticle]);

  const handleToggleFavorite = useCallback(() => {
    if (!article) return;
    if (article.isFavorite) {
      unfavoriteArticle.mutate(article.id);
    } else {
      favoriteArticle.mutate(article.id);
    }
  }, [article, favoriteArticle, unfavoriteArticle]);

  const handleMarkUnread = useCallback(() => {
    if (!article) return;
    markAsUnread.mutate(article.id);
  }, [article, markAsUnread]);

  const formattedRelativeTime = useMemo(
    () => (article ? formatRelativeTime(article.time) : ''),
    [article?.time]
  );

  const formattedFullDate = useMemo(
    () => (article ? formatFullDate(article.time) : ''),
    [article?.time]
  );

  const cleanedText = useMemo(
    () => (article?.text ? article.text.replace(/<[^>]*>/g, '') : ''),
    [article?.text]
  );

  const readIconName = useMemo(
    () => `eye${article?.isRead ? '-check' : '-outline'}`,
    [article?.isRead]
  );

  const titleStyle = useMemo(
    () => [styles.title, { color: theme.colors.onBackground }],
    [theme.colors.onBackground]
  );

  const textStyle = useMemo(
    () => [styles.text, { color: theme.colors.onBackground }],
    [theme.colors.onBackground]
  );

  const secondaryTextColor = useMemo(
    () => ({ color: theme.custom.colors.textSecondary }),
    [theme.custom.colors.textSecondary]
  );

  const headerActions = useMemo(
    () =>
      article
        ? [
            {
              icon: article.isSaved ? 'bookmark' : 'bookmark-outline',
              onPress: handleToggleSave,
              accessibilityLabel: article.isSaved ? 'Unsave' : 'Save',
            },
            {
              icon: article.isFavorite ? 'star' : 'star-outline',
              onPress: handleToggleFavorite,
              accessibilityLabel: article.isFavorite ? 'Unfavorite' : 'Favorite',
            },
          ]
        : [],
    [article, handleToggleSave, handleToggleFavorite]
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading article..." />;
  }

  if (!article) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <ScreenHeader
          title="Article"
          showBack
          onBack={handleGoBack}
        />
        <EmptyState
          icon="alert-circle"
          title="Article Not Found"
          message="This article could not be loaded"
          actionLabel="Go Back"
          onAction={handleGoBack}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader
        title="Article"
        showBack
        onBack={handleGoBack}
        actions={headerActions}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <Text variant="headlineMedium" style={titleStyle}>
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
            <Text variant="bodyMedium" style={secondaryTextColor}>
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
            <Text variant="bodyMedium" style={secondaryTextColor}>
              {formattedRelativeTime}
            </Text>
          </View>

          <View style={styles.metadataRow}>
            <Icon
              name="calendar"
              size={16}
              color={theme.custom.colors.textSecondary}
              style={styles.icon}
            />
            <Text variant="bodyMedium" style={secondaryTextColor}>
              {formattedFullDate}
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
          <Chip icon={readIconName} style={styles.statChip}>
            {article.isRead ? 'Read' : 'Unread'}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        {article.text && (
          <View style={styles.textContainer}>
            <Text variant="bodyLarge" style={textStyle}>
              {cleanedText}
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
