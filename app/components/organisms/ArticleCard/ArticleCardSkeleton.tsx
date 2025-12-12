import React from 'react';
import { View } from 'react-native';
import { Card, CardContent, Skeleton } from '../../atoms';
import { styles } from './ArticleCard.styles';

export function ArticleCardSkeleton() {
  return (
    <Card style={styles.card} mode="elevated">
      <CardContent style={styles.content}>
        {/* Title skeleton */}
        <Skeleton width="90%" height={22} borderRadius={4} style={styles.title} />
        <Skeleton width="70%" height={22} borderRadius={4} style={{ marginBottom: 8 }} />

        {/* Metadata skeleton */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
          <Skeleton width={60} height={16} borderRadius={4} style={{ marginRight: 12 }} />
          <Skeleton width={80} height={16} borderRadius={4} style={{ marginRight: 12 }} />
          <Skeleton width={70} height={16} borderRadius={4} style={{ marginRight: 12 }} />
          <Skeleton width={50} height={16} borderRadius={4} />
        </View>

        {/* Domain chip skeleton */}
        <Skeleton width={100} height={14} borderRadius={4} style={{ marginBottom: 8 }} />

        {/* Status chips skeleton */}
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Skeleton width={50} height={20} borderRadius={10} style={{ marginRight: 8 }} />
          <Skeleton width={50} height={20} borderRadius={10} />
        </View>

        {/* Action buttons skeleton */}
        <View style={{ flexDirection: 'row' }}>
          <Skeleton width={24} height={24} borderRadius={12} style={{ marginRight: 8 }} />
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
      </CardContent>
    </Card>
  );
}
