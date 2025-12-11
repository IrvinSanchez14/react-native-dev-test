import React from 'react';
import { Divider as PaperDivider } from 'react-native-paper';
import type { DividerProps as PaperDividerProps } from 'react-native-paper';

export interface DividerProps extends PaperDividerProps {
  // Add custom props if needed in the future
}

export function Divider({ ...props }: DividerProps) {
  return <PaperDivider {...props} />;
}
