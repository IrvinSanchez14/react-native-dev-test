import React from 'react';
import { Switch as PaperSwitch } from 'react-native-paper';
import type { SwitchProps as PaperSwitchProps } from 'react-native-paper';

export interface SwitchProps extends PaperSwitchProps {
  // Add custom props if needed in the future
}

export function Switch({ ...props }: SwitchProps) {
  return <PaperSwitch {...props} />;
}
