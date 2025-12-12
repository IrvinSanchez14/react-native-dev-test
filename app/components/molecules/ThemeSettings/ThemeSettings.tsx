import React from 'react';
import { Card, CardContent, Text, SegmentedButtons } from '../../atoms';
import { styles } from './ThemeSettings.styles';

export interface ThemeSettingsProps {
  themeMode: 'light' | 'dark' | 'auto';
  onThemeChange: (mode: 'light' | 'dark' | 'auto') => void;
}

export function ThemeSettings({ themeMode, onThemeChange }: ThemeSettingsProps) {
  return (
    <Card style={styles.card} mode="elevated">
      <CardContent style={styles.cardContent}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Appearance
        </Text>

        <Text variant="bodyMedium" style={styles.sectionLabel}>
          Theme
        </Text>

        <SegmentedButtons
          value={themeMode}
          onValueChange={(value) => onThemeChange(value as 'light' | 'dark' | 'auto')}
          buttons={[
            {
              value: 'light',
              label: 'Light',
              icon: 'white-balance-sunny',
            },
            {
              value: 'dark',
              label: 'Dark',
              icon: 'moon-waning-crescent',
            },
            {
              value: 'auto',
              label: 'Auto',
              icon: 'theme-light-dark',
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

