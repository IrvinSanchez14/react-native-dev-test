import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MobileArticlesScreen } from '../screens/MobileArticlesScreen';
import { ArticleWebViewScreen } from '../screens/ArticleWebViewScreen';

export type RootStackParamList = {
  MobileArticles: undefined;
  ArticleWebView: {
    url: string;
    title: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MobileArticles" component={MobileArticlesScreen} />
      <Stack.Screen name="ArticleWebView" component={ArticleWebViewScreen} />
    </Stack.Navigator>
  );
}
