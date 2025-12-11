import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Root Tab Navigator param list (will be updated below after mobile stack definitions)

// Stack Navigator param lists for each tab
export type TopStoriesStackParamList = {
  TopStoriesList: undefined;
  ArticleDetail: { articleId: number };
};

export type NewStoriesStackParamList = {
  NewStoriesList: undefined;
  ArticleDetail: { articleId: number };
};

export type BestStoriesStackParamList = {
  BestStoriesList: undefined;
  ArticleDetail: { articleId: number };
};

export type AskHNStackParamList = {
  AskHNList: undefined;
  ArticleDetail: { articleId: number };
};

export type SavedStackParamList = {
  SavedList: undefined;
  ArticleDetail: { articleId: number };
  Settings: undefined;
};

// Tab screen props
export type TopStoriesTabScreenProps = BottomTabScreenProps<RootTabParamList, 'TopStoriesTab'>;
export type NewStoriesTabScreenProps = BottomTabScreenProps<RootTabParamList, 'NewStoriesTab'>;
export type BestStoriesTabScreenProps = BottomTabScreenProps<RootTabParamList, 'BestStoriesTab'>;
export type AskHNTabScreenProps = BottomTabScreenProps<RootTabParamList, 'AskHNTab'>;
export type SavedTabScreenProps = BottomTabScreenProps<RootTabParamList, 'SavedTab'>;

// Screen props for each stack
export type TopStoriesListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<TopStoriesStackParamList, 'TopStoriesList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type NewStoriesListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<NewStoriesStackParamList, 'NewStoriesList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type BestStoriesListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<BestStoriesStackParamList, 'BestStoriesList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type AskHNListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AskHNStackParamList, 'AskHNList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type SavedListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SavedStackParamList, 'SavedList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type ArticleDetailScreenProps = CompositeScreenProps<
  NativeStackScreenProps<TopStoriesStackParamList | NewStoriesStackParamList | BestStoriesStackParamList | AskHNStackParamList | SavedStackParamList, 'ArticleDetail'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type SettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SavedStackParamList, 'Settings'>,
  BottomTabScreenProps<RootTabParamList>
>;

// Mobile Articles Stack (for ArticlesTab)
export type ArticlesStackParamList = {
  ArticlesList: undefined;
  ArticleWebView: { url: string; title: string };
};

// Favorites Stack (for FavoritesTab)
export type FavoritesStackParamList = {
  FavoritesList: undefined;
  ArticleWebView: { url: string; title: string };
};

// Deleted Stack (for DeletedTab)
export type DeletedStackParamList = {
  DeletedList: undefined;
};

// Settings Stack (for SettingsTab)
export type SettingsStackParamList = {
  SettingsList: undefined;
};

// Update RootTabParamList to include mobile tabs
export type RootTabParamList = {
  TopStoriesTab: NavigatorScreenParams<TopStoriesStackParamList>;
  NewStoriesTab: NavigatorScreenParams<NewStoriesStackParamList>;
  BestStoriesTab: NavigatorScreenParams<BestStoriesStackParamList>;
  AskHNTab: NavigatorScreenParams<AskHNStackParamList>;
  SavedTab: NavigatorScreenParams<SavedStackParamList>;
  ArticlesTab: NavigatorScreenParams<ArticlesStackParamList>;
  FavoritesTab: NavigatorScreenParams<FavoritesStackParamList>;
  DeletedTab: NavigatorScreenParams<DeletedStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

// Mobile screen props
export type MobileArticlesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ArticlesStackParamList, 'ArticlesList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type FavoritesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<FavoritesStackParamList, 'FavoritesList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type DeletedArticlesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DeletedStackParamList, 'DeletedList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type ArticleWebViewScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ArticlesStackParamList | FavoritesStackParamList, 'ArticleWebView'>,
  BottomTabScreenProps<RootTabParamList>
>;

// Declare global namespace for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
