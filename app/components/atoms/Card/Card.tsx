import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

export interface CardProps {
  children?: React.ReactNode;
  mode?: 'elevated' | 'outlined' | 'contained';
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  onLongPress?: () => void;
  accessible?: boolean;
  accessibilityLabel?: string;
}

export function Card({ children, mode, style, ...props }: CardProps) {
  return <PaperCard mode={mode} style={style} {...props}>{children}</PaperCard>;
}
