import React from 'react';
import { Appbar } from 'react-native-paper';

export interface AppbarBackActionProps {
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function AppbarBackAction({ onPress, disabled, accessibilityLabel }: AppbarBackActionProps) {
  return (
    <Appbar.BackAction
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
