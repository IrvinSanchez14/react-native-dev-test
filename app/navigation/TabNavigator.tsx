import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../theme/theme';
import { MobileArticlesScreen } from '../screens/MobileArticlesScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { DeletedArticlesScreen } from '../screens/DeletedArticlesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ArticleWebViewScreen } from '../screens/ArticleWebViewScreen';

// Stack navigators for each tab
const ArticlesStack = createNativeStackNavigator();
const FavoritesStack = createNativeStackNavigator();
const DeletedStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function ArticlesStackScreen() {
  return (
    <ArticlesStack.Navigator screenOptions={{ headerShown: false }}>
      <ArticlesStack.Screen name="ArticlesList" component={MobileArticlesScreen} />
      <ArticlesStack.Screen name="ArticleWebView" component={ArticleWebViewScreen} />
    </ArticlesStack.Navigator>
  );
}

function FavoritesStackScreen() {
  return (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStack.Screen name="FavoritesList" component={FavoritesScreen} />
      <FavoritesStack.Screen name="ArticleWebView" component={ArticleWebViewScreen} />
    </FavoritesStack.Navigator>
  );
}

function DeletedStackScreen() {
  return (
    <DeletedStack.Navigator screenOptions={{ headerShown: false }}>
      <DeletedStack.Screen name="DeletedList" component={DeletedArticlesScreen} />
    </DeletedStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsList" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

// Bottom tab navigator
const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const theme = useTheme<AppTheme>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.custom.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.custom.colors.border,
        },
      }}
    >
      <Tab.Screen
        name="ArticlesTab"
        component={ArticlesStackScreen}
        options={{
          title: 'Articles',
          tabBarIcon: ({ color, size }) => <Icon name="newspaper-variant" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => <Icon name="star" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="DeletedTab"
        component={DeletedStackScreen}
        options={{
          title: 'Deleted',
          tabBarIcon: ({ color, size }) => <Icon name="delete" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Icon name="cog" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
