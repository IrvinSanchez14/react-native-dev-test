import React from 'react';
import { Appbar } from 'react-native-paper';

export interface AppbarActionProps {
  icon: string;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function AppbarAction({ icon, onPress, disabled, accessibilityLabel }: AppbarActionProps) {
  return (
    <Appbar.Action
      icon={icon}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
