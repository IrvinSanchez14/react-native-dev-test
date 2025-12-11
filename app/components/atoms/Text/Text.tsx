import React from 'react';
import { Text as PaperText } from 'react-native-paper';
import type { TextProps as PaperTextProps } from 'react-native-paper';

export interface TextProps extends PaperTextProps<never> {

}

export function Text({ ...props }: TextProps) {
  return <PaperText {...props} />;
}
