import React from 'react';
import { View } from 'react-native';
import { Card, CardContent, Skeleton } from '../../atoms';
import { styles } from './SwipeableArticleCard.styles';

export function SwipeableArticleCardSkeleton() {
  return (
    <Card style={styles.card} mode="elevated">
      <CardContent style={styles.content}>
        {/* Title skeleton */}
        <Skeleton width="85%" height={22} borderRadius={4} style={styles.title} />
        <Skeleton width="60%" height={22} borderRadius={4} style={{ marginBottom: 8 }} />

        {/* Metadata row skeleton */}
        <View style={styles.metadata}>
          <Skeleton width={50} height={16} borderRadius={4} style={{ marginRight: 12 }} />
          <Skeleton width={50} height={16} borderRadius={4} style={{ marginRight: 12 }} />
          <Skeleton width={70} height={16} borderRadius={4} style={{ marginRight: 12 }} />
          <Skeleton width={60} height={16} borderRadius={4} />
        </View>

        {/* Domain skeleton */}
        <Skeleton width={120} height={14} borderRadius={4} style={styles.domain} />

        {/* Favorite button skeleton */}
        <View style={styles.favoriteContainer}>
          <Skeleton width={20} height={20} borderRadius={10} />
        </View>
      </CardContent>
    </Card>
  );
}
