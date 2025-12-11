import React from 'react';
import { Text as PaperText } from 'react-native-paper';
import type { TextProps as PaperTextProps } from 'react-native-paper';

export interface TextProps extends PaperTextProps<never> {
  // Add custom props if needed in the future
}

export function Text({ ...props }: TextProps) {
  return <PaperText {...props} />;
}
