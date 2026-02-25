import Config from 'react-native-config';

export const ENV = {
  PRIVY_APP_ID: Config.PRIVY_APP_ID || '',
  PRIVY_CLIENT_ID: Config.PRIVY_CLIENT_ID || '',
  RPC_URL: Config.RPC_URL || 'https://sepolia.base.org',
  IS_PRODUCTION: Config.IS_PRODUCTION === 'true',
};
