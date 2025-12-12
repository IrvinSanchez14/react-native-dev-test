import React, { Component, ErrorInfo, ReactNode, useMemo, memo } from 'react';
import { View, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from './atoms';
import { Icon } from './atoms/Icon';
import { errorTracker } from '../services/errorTracking/errorTracker';
import { styles } from './ErrorBoundary.styles';

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

function getUserFriendlyErrorMessage(error: Error): string {
  const message = error.message || 'Unknown error';

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

  if (__DEV__) {
    return message;
  }

  return 'Something unexpected happened. Please try again or restart the app.';
}

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
    this.setState({ errorInfo });

    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (reportingError) {
      }
    }

    try {
      errorTracker.captureException(error, {
        componentStack: errorInfo.componentStack,
        errorName: error.name,
      });
    } catch (trackingError) {
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

interface ErrorFallbackUIProps {
  error: Error;
  onReset: () => void;
}

const ErrorFallbackUI = memo<ErrorFallbackUIProps>(({ error, onReset }) => {
  const colorScheme = useColorScheme();
  
  const themeColors = useMemo(() => {
    const isDark = colorScheme === 'dark';
    return {
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      textColor: isDark ? '#FFFFFF' : '#000000',
      secondaryTextColor: isDark ? '#AAAAAA' : '#666666',
      errorColor: '#F44336',
      surfaceVariantColor: isDark ? '#3C3C3C' : '#F5F5F5',
    };
  }, [colorScheme]);

  const userMessage = useMemo(
    () => getUserFriendlyErrorMessage(error),
    [error]
  );

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: themeColors.backgroundColor }],
    [themeColors.backgroundColor]
  );

  const titleStyle = useMemo(
    () => [styles.title, { color: themeColors.textColor }],
    [themeColors.textColor]
  );

  const messageStyle = useMemo(
    () => [styles.message, { color: themeColors.secondaryTextColor }],
    [themeColors.secondaryTextColor]
  );

  const debugContainerStyle = useMemo(
    () => [styles.debugContainer, { backgroundColor: themeColors.surfaceVariantColor }],
    [themeColors.surfaceVariantColor]
  );

  const debugTextStyle = useMemo(
    () => [styles.debugText, { color: themeColors.secondaryTextColor }],
    [themeColors.secondaryTextColor]
  );

  const debugTitleStyle = useMemo(
    () => [styles.debugTitle, { color: themeColors.secondaryTextColor }],
    [themeColors.secondaryTextColor]
  );

  return (
    <SafeAreaView style={containerStyle} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Icon name="alert-circle" size={64} color={themeColors.errorColor} />
        <Text variant="headlineSmall" style={titleStyle}>
          Something went wrong
        </Text>
        <Text variant="bodyMedium" style={messageStyle}>
          {userMessage}
        </Text>
        {__DEV__ && error.stack && (
          <View style={debugContainerStyle}>
            <Text variant="labelSmall" style={debugTitleStyle}>
              Debug Information (Development Only):
            </Text>
            <ScrollView style={styles.debugScroll} nestedScrollEnabled>
              <Text variant="bodySmall" style={debugTextStyle}>
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
});

ErrorFallbackUI.displayName = 'ErrorFallbackUI';
