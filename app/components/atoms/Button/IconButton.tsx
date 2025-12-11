import React from 'react';
import { IconButton as PaperIconButton } from 'react-native-paper';
import type { IconButtonProps as PaperIconButtonProps } from 'react-native-paper';

export interface IconButtonProps extends PaperIconButtonProps {

}

export function IconButton({ ...props }: IconButtonProps) {
  return <PaperIconButton {...props} />;
}
