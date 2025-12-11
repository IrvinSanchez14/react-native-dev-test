import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    lineHeight: 32,
  },
  metadata: {
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  textContainer: {
    marginBottom: 16,
  },
  text: {
    lineHeight: 24,
  },
  urlButton: {
    marginBottom: 16,
  },
  actions: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
});
