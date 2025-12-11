import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, CardContent, Text, SegmentedButtons } from '../../atoms';

export interface ThemeSettingsProps {
  themeMode: 'light' | 'dark' | 'auto';
  onThemeChange: (mode: 'light' | 'dark' | 'auto') => void;
}

export function ThemeSettings({ themeMode, onThemeChange }: ThemeSettingsProps) {
  return (
    <Card style={styles.card} mode="elevated">
      <CardContent>
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

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  sectionLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
});

