import React from 'react';
import { Divider as PaperDivider } from 'react-native-paper';
import type { DividerProps as PaperDividerProps } from 'react-native-paper';

export interface DividerProps extends PaperDividerProps {

}

export function Divider({ ...props }: DividerProps) {
  return <PaperDivider {...props} />;
}
