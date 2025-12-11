import React from 'react';
import { TextStyle } from 'react-native';
import { Appbar } from 'react-native-paper';

export interface AppbarContentProps {
  title: string;
  subtitle?: string;
  titleStyle?: TextStyle | TextStyle[];
}

export function AppbarContent({ title, subtitle, titleStyle }: AppbarContentProps) {
  return <Appbar.Content title={title} subtitle={subtitle} titleStyle={titleStyle} />;
}
