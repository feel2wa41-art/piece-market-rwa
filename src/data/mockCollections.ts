import {AssetCollection} from '../types/swap';

export const COLLECTIONS: AssetCollection[] = [
  {
    id: 'col-pokemon',
    name: 'Pokemon Masters',
    icon: '⚡',
    assetIds: ['1', '5'], // Charizard, Pikachu
  },
  {
    id: 'col-kpop',
    name: 'K-Pop Legends',
    icon: '🎵',
    assetIds: ['2', '6'], // BTS, BLACKPINK
  },
  {
    id: 'col-luxury',
    name: 'Luxury Vault',
    icon: '💎',
    assetIds: ['3', '7'], // Hermès, Rolex
  },
  {
    id: 'col-art',
    name: 'Art & Collectibles',
    icon: '🎨',
    assetIds: ['4', '8'], // Banksy, Star Wars
  },
  {
    id: 'col-music',
    name: 'Music Royalties',
    icon: '🎤',
    assetIds: ['9', '10'], // Neon Dreams, Seoul Midnight
  },
];
