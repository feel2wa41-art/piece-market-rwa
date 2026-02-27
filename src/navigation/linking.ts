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
              AssetCertificate: 'asset/:assetId/certificate',
            },
          },
          MarketTab: {
            screens: {
              Market: 'market',
              AssetDetail: 'market/asset/:assetId',
              AssetCertificate: 'market/asset/:assetId/certificate',
            },
          },
          SwapTab: {
            screens: {
              SwapMarket: 'swap',
              SwapDetail: 'swap/:swapId',
              CreateSwap: 'swap/create',
            },
          },
          PortfolioTab: {
            screens: {
              Portfolio: 'portfolio',
              AssetDetail: 'portfolio/asset/:assetId',
              AssetCertificate: 'portfolio/asset/:assetId/certificate',
              TransactionHistory: 'portfolio/transactions',
            },
          },
          AdminTab: {
            screens: {
              AdminDashboard: 'admin',
              RevenueWithdrawal: 'admin/withdraw',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
              LanguageSettings: 'profile/language',
              WalletDetail: 'profile/wallet',
              SellerRegistration: 'profile/seller-register',
              Docs: 'profile/docs',
            },
          },
        },
      },
    },
  },
};
