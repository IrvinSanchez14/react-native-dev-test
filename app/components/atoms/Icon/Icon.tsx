import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export interface IconProps {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Icon(props: IconProps) {
  const { name, size = 24, color, style } = props;
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
}
