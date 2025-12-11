import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from './atoms';
import { Icon } from './atoms/Icon';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Gets a user-friendly error message from an error
 */
function getUserFriendlyErrorMessage(error: Error): string {
  const message = error.message || 'Unknown error';

  // Handle common error patterns
  if (message.includes('Network') || message.includes('fetch')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (message.includes('timeout')) {
    return 'The request took too long. Please try again.';
  }

  if (message.includes('JSON') || message.includes('parse')) {
    return 'There was a problem processing the data. Please try again.';
  }

  if (message.includes('database') || message.includes('SQL')) {
    return 'There was a problem accessing local data. Please restart the app.';
  }

  // For development, show more details
  if (__DEV__) {
    return message;
  }

  // Generic user-friendly message for production
  return 'Something unexpected happened. Please try again or restart the app.';
}

/**
 * Enhanced Error Boundary component with theme support and better error handling
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Store error info for potential reporting
    this.setState({ errorInfo });

    // Enhanced error logging with context
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error name:', error.name);
    console.error('[ErrorBoundary] Error message:', error.message);
    console.error('[ErrorBoundary] Error stack:', error.stack);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

    // Call optional error handler (e.g., for error tracking services)
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (reportingError) {
        console.error('[ErrorBoundary] Error in onError handler:', reportingError);
      }
    }

    // Send to error tracking service
    try {
      const { errorTracker } = require('../services/errorTracking/errorTracker');
      errorTracker.captureException(error, {
        componentStack: errorInfo.componentStack,
        errorName: error.name,
      });
    } catch (trackingError) {
      console.error('[ErrorBoundary] Failed to track error:', trackingError);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return <ErrorFallbackUI error={this.state.error} onReset={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Error fallback UI component with theme support
 * Uses color scheme to determine theme colors (works even outside PaperProvider)
 */
function ErrorFallbackUI({ error, onReset }: { error: Error; onReset: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const userMessage = getUserFriendlyErrorMessage(error);

  // Theme colors based on color scheme
  const backgroundColor = isDark ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#AAAAAA' : '#666666';
  const errorColor = '#F44336';
  const surfaceVariantColor = isDark ? '#3C3C3C' : '#F5F5F5';

  const containerStyle = [
    styles.container,
    { backgroundColor },
  ];

  const titleStyle = [
    styles.title,
    { color: textColor },
  ];

  const messageStyle = [
    styles.message,
    { color: secondaryTextColor },
  ];

  return (
    <SafeAreaView style={containerStyle} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Icon name="alert-circle" size={64} color={errorColor} />
        <Text variant="headlineSmall" style={titleStyle}>
          Something went wrong
        </Text>
        <Text variant="bodyMedium" style={messageStyle}>
          {userMessage}
        </Text>
        {__DEV__ && error.stack && (
          <View style={[styles.debugContainer, { backgroundColor: surfaceVariantColor }]}>
            <Text variant="labelSmall" style={[styles.debugTitle, { color: secondaryTextColor }]}>
              Debug Information (Development Only):
            </Text>
            <ScrollView style={styles.debugScroll} nestedScrollEnabled>
              <Text variant="bodySmall" style={[styles.debugText, { color: secondaryTextColor }]}>
                {error.name}: {error.message}
                {'\n\n'}
                {error.stack}
              </Text>
            </ScrollView>
          </View>
        )}
        <Button mode="contained" onPress={onReset} style={styles.button}>
          Try Again
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
