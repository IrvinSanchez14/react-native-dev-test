import React from 'react';
import { Chip as PaperChip } from 'react-native-paper';
import type { ChipProps as PaperChipProps } from 'react-native-paper';

export interface ChipProps extends PaperChipProps {
  // Add custom props if needed in the future
}

export function Chip({ ...props }: ChipProps) {
  return <PaperChip {...props} />;
}
