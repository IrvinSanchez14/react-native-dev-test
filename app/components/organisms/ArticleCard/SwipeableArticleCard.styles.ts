import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  content: {
    paddingVertical: 12,
  },
  title: {
    marginBottom: 8,
    lineHeight: 22,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  domain: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  favoriteContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
