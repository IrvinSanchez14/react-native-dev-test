import React from 'react';
import { AppbarHeader, AppbarContent, AppbarBackAction, AppbarAction } from '../../atoms';

export interface ScreenHeaderAction {
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: ScreenHeaderAction[];
}

export function ScreenHeader({ title, subtitle, showBack, onBack, actions }: ScreenHeaderProps) {
  return (
    <AppbarHeader>
      {showBack && <AppbarBackAction onPress={onBack} />}
      <AppbarContent title={title} subtitle={subtitle} titleStyle={{ fontSize: 20, marginLeft: 15 }} />
      {actions?.map((action, index) => (
        <AppbarAction
          key={index}
          icon={action.icon}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
        />
      ))}
    </AppbarHeader>
  );
}

