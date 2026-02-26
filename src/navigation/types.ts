import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  MarketTab: NavigatorScreenParams<MarketStackParamList>;
  SwapTab: NavigatorScreenParams<SwapStackParamList>;
  PortfolioTab: NavigatorScreenParams<PortfolioStackParamList>;
  AdminTab?: NavigatorScreenParams<AdminStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  AssetDetail: {assetId: string};
  AssetCertificate: {assetId: string};
};

export type MarketStackParamList = {
  Market: undefined;
  AssetDetail: {assetId: string};
  AssetCertificate: {assetId: string};
};

export type PortfolioStackParamList = {
  Portfolio: undefined;
  AssetDetail: {assetId: string};
  AssetCertificate: {assetId: string};
  TransactionHistory: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  LanguageSettings: undefined;
  WalletDetail: undefined;
  SellerRegistration: undefined;
};

export type SwapStackParamList = {
  SwapMarket: undefined;
  SwapDetail: {swapId: string};
  CreateSwap: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  RevenueWithdrawal: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList>
>;

export type MarketScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MarketStackParamList, 'Market'>,
  BottomTabScreenProps<MainTabParamList>
>;

export type PortfolioScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PortfolioStackParamList, 'Portfolio'>,
  BottomTabScreenProps<MainTabParamList>
>;

export type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'Profile'>,
  BottomTabScreenProps<MainTabParamList>
>;

export type AssetDetailScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'AssetDetail'
>;

export type LanguageSettingsScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'LanguageSettings'
>;
