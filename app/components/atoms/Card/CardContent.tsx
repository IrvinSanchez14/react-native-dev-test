import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';

export interface CardContentProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function CardContent({ children, style }: CardContentProps) {
  return <Card.Content style={style}>{children}</Card.Content>;
}
