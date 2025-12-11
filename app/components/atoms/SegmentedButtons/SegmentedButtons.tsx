import React from 'react';
import { SegmentedButtons as PaperSegmentedButtons } from 'react-native-paper';

export interface SegmentedButtonsProps {
  value: string;
  onValueChange: (value: string) => void;
  buttons: Array<{
    value: string;
    label: string;
    icon?: string;
    disabled?: boolean;
    accessibilityLabel?: string;
    showSelectedCheck?: boolean;
  }>;
  density?: 'regular' | 'small' | 'medium' | 'high';
}

export function SegmentedButtons({ ...props }: SegmentedButtonsProps) {
  return <PaperSegmentedButtons {...props} />;
}
