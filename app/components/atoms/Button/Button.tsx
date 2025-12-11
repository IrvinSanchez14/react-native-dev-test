import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import type { ButtonProps as PaperButtonProps } from 'react-native-paper';

export interface ButtonProps extends PaperButtonProps {
  fullWidth?: boolean;
}

export function Button({ fullWidth, style, ...props }: ButtonProps) {
  return (
    <PaperButton
      style={[fullWidth && { width: '100%' }, style]}
      {...props}
    />
  );
}
