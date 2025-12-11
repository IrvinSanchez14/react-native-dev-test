import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.9,
  },
  button: {
    marginTop: 8,
    minWidth: 120,
  },
  debugContainer: {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    maxHeight: 200,
  },
  debugTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  debugScroll: {
    maxHeight: 150,
  },
  debugText: {
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
});
