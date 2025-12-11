import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import { Chip } from '../../atoms';

export interface DomainChipProps {
  url: string;
  onPress?: () => void;
}

const getDomain = (url: string): string => {
  if (!url) return '';
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return '';
  }
};

export function DomainChip({ url, onPress }: DomainChipProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      Linking.openURL(url);
    }
  };

  const domain = getDomain(url);
  if (!domain) return null;

  return (
    <Chip
      mode="outlined"
      compact
      style={styles.chip}
      textStyle={styles.text}
      onPress={handlePress}
      icon="open-in-new"
    >
      {domain}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    height: 24,
  },
  text: {
    fontSize: 11,
  },
});
