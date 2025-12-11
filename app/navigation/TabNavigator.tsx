import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../theme/theme';
import { MobileArticlesScreen } from '../screens/MobileArticlesScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { DeletedArticlesScreen } from '../screens/DeletedArticlesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ArticleWebViewScreen } from '../screens/ArticleWebViewScreen';
import type {
  ArticlesStackParamList,
  FavoritesStackParamList,
  DeletedStackParamList,
  SettingsStackParamList,
  RootTabParamList,
} from '../types/navigation';

const ArticlesStack = createNativeStackNavigator<ArticlesStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();
const DeletedStack = createNativeStackNavigator<DeletedStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const commonStackScreenOptions = { headerShown: false };

const ArticlesStackScreen = () => (
  <ArticlesStack.Navigator screenOptions={commonStackScreenOptions}>
    <ArticlesStack.Screen name="ArticlesList" component={MobileArticlesScreen} />
    <ArticlesStack.Screen name="ArticleWebView" component={ArticleWebViewScreen} />
  </ArticlesStack.Navigator>
);

const FavoritesStackScreen = () => (
  <FavoritesStack.Navigator screenOptions={commonStackScreenOptions}>
    <FavoritesStack.Screen name="FavoritesList" component={FavoritesScreen} />
    <FavoritesStack.Screen name="ArticleWebView" component={ArticleWebViewScreen} />
  </FavoritesStack.Navigator>
);

const DeletedStackScreen = () => (
  <DeletedStack.Navigator screenOptions={commonStackScreenOptions}>
    <DeletedStack.Screen name="DeletedList" component={DeletedArticlesScreen} />
  </DeletedStack.Navigator>
);

const SettingsStackScreen = () => (
  <SettingsStack.Navigator screenOptions={commonStackScreenOptions}>
    <SettingsStack.Screen name="SettingsList" component={SettingsScreen} />
  </SettingsStack.Navigator>
);

const Tab = createBottomTabNavigator<RootTabParamList>();

const createTabBarIcon = (iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name']) =>
  ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons name={iconName} color={color} size={size} />
  );

export const TabNavigator = () => {
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
          tabBarIcon: createTabBarIcon('newspaper-variant'),
        }}
      />

      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: createTabBarIcon('star'),
        }}
      />

      <Tab.Screen
        name="DeletedTab"
        component={DeletedStackScreen}
        options={{
          title: 'Deleted',
          tabBarIcon: createTabBarIcon('delete'),
        }}
      />

      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackScreen}
        options={{
          title: 'Settings',
          tabBarIcon: createTabBarIcon('cog'),
        }}
      />
    </Tab.Navigator>
  );
};
