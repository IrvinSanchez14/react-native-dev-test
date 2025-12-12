import React from 'react';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenHeader } from '../components/molecules';
import type { AppTheme } from '../theme/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from './styles/ArticleWebViewScreen.styles';

type ArticleWebViewScreenProps = NativeStackScreenProps<RootStackParamList, 'ArticleWebView'>;

export function ArticleWebViewScreen() {
  const theme = useTheme<AppTheme>();
  const route = useRoute<ArticleWebViewScreenProps['route']>();
  const navigation = useNavigation<ArticleWebViewScreenProps['navigation']>();
  const { url, title } = route.params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader
        title={title}
        showBack
        onBack={() => navigation.goBack()}
      />

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
}
