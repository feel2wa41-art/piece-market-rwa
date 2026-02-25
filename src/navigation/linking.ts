import {LinkingOptions} from '@react-navigation/native';
import {RootStackParamList} from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['piecemarket://', 'https://piecemarket.com'],
  config: {
    screens: {
      Auth: 'login',
      Onboarding: 'onboarding',
      MainTabs: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              AssetDetail: 'asset/:assetId',
            },
          },
          MarketTab: {
            screens: {
              Market: 'market',
              AssetDetail: 'market/asset/:assetId',
            },
          },
          PortfolioTab: {
            screens: {
              Portfolio: 'portfolio',
              AssetDetail: 'portfolio/asset/:assetId',
              TransactionHistory: 'portfolio/transactions',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
              LanguageSettings: 'profile/language',
              WalletDetail: 'profile/wallet',
            },
          },
        },
      },
    },
  },
};
