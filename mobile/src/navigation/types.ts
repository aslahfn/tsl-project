import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Teams: undefined;
  TeamDetail: { slug: string; name: string };
  Players: undefined;
  PlayerDetail: { id: string; name: string };
  Fixtures: undefined;
  Standings: undefined;
  News: undefined;
  NewsDetail: { slug: string; title: string };
  Notifications: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  TeamsTab: undefined;
  FixturesTab: undefined;
  StandingsTab: undefined;
  MoreTab: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type TeamDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'TeamDetail'>;
export type PlayerDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PlayerDetail'>;
export type NewsDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;
