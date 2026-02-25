# PieceMarket RWA

RWA-based Fractional Investment Platform using React Native and Account Abstraction.

## Tech Stack

- **React Native CLI** (Bare) with TypeScript
- **React Navigation** v7 - Bottom tabs + Stack navigation
- **i18next** - Internationalization (EN / KO / ID)
- **Zustand** - State management with AsyncStorage persistence
- **viem** - Base (EVM) blockchain interaction
- **Privy** - Account Abstraction wallet (planned)

## Getting Started

```bash
# Install dependencies
npm install

# Run Android
npx react-native run-android

# Run iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

## Project Structure

```
src/
├── assets/          # Fonts, images, animations
├── components/      # Reusable UI components
├── screens/         # Screen components (home, market, portfolio, profile, auth)
├── navigation/      # React Navigation setup
├── i18n/            # Internationalization (en, ko, id)
├── services/        # Blockchain & wallet services
├── store/           # Zustand state stores
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── constants/       # App constants (theme, fees, chains)
└── config/          # Environment configuration
```

## Supported Languages

- English (en)
- Korean (ko) - 한국어
- Indonesian (id) - Bahasa Indonesia

## Blockchain

- **Network**: Base (Coinbase L2)
- **Token Standard**: ERC-1155 (fractional ownership)
- **Testnet**: Base Sepolia
