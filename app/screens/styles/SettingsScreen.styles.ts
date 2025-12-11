import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
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
  divider: {
    marginVertical: 16,
  },
  testButton: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
  },
});
