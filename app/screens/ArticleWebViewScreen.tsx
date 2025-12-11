import React from 'react';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from './styles/ArticleWebViewScreen.styles';

type RouteProp = { params: RootStackParamList['ArticleWebView'] };
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ArticleWebViewScreen() {
  const route = useRoute<RouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { url, title } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={title} titleStyle={styles.title} />
      </Appbar.Header>

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
