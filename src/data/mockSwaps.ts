import {SwapOffer} from '../types/swap';

// Pre-populated swap offers from "other users"
// Designed to tempt the demo investor who holds Charizard + BTS fractions
export const MOCK_SWAP_OFFERS: SwapOffer[] = [
  {
    id: 'swap-1',
    offerer: {id: 'u-card99', name: 'CardCollector99', avatar: '🃏'},
    offerAssetId: '5',    // Pikachu VMAX
    offerFractions: 10,
    wantAssetId: '1',     // Charizard PSA 10
    wantFractions: 2,
    status: 'OPEN',
    message: 'Fair trade! Pikachu is rising fast 🚀',
    createdAt: '2026-02-24T10:00:00Z',
    expiresAt: '2026-03-01T10:00:00Z',
    demandCount: 7,
  },
  {
    id: 'swap-2',
    offerer: {id: 'u-kpop', name: 'KPopFan_Seoul', avatar: '🎤'},
    offerAssetId: '6',    // BLACKPINK Lightstick
    offerFractions: 5,
    wantAssetId: '2',     // BTS PROOF
    wantFractions: 3,
    status: 'OPEN',
    message: 'Complete your K-Pop set! 💜',
    createdAt: '2026-02-24T14:00:00Z',
    expiresAt: '2026-03-02T14:00:00Z',
    demandCount: 12,
  },
  {
    id: 'swap-3',
    offerer: {id: 'u-lux', name: 'LuxuryHunter', avatar: '👑'},
    offerAssetId: '3',    // Hermès Birkin
    offerFractions: 2,
    wantAssetId: '1',     // Charizard
    wantFractions: 1,
    status: 'OPEN',
    message: 'Diversify into luxury!',
    createdAt: '2026-02-23T09:00:00Z',
    demandCount: 5,
  },
  {
    id: 'swap-4',
    offerer: {id: 'u-art', name: 'ArtLover42', avatar: '🖼'},
    offerAssetId: '4',    // Banksy Print
    offerFractions: 3,
    wantAssetId: '2',     // BTS PROOF
    wantFractions: 4,
    status: 'OPEN',
    message: 'Banksy never loses value 📈',
    createdAt: '2026-02-22T18:00:00Z',
    demandCount: 3,
  },
  {
    id: 'swap-5',
    offerer: {id: 'u-watch', name: 'WatchManiac', avatar: '⌚'},
    offerAssetId: '7',    // Rolex Daytona
    offerFractions: 3,
    wantAssetId: '5',     // Pikachu
    wantFractions: 8,
    status: 'OPEN',
    createdAt: '2026-02-24T20:00:00Z',
    expiresAt: '2026-03-03T20:00:00Z',
    demandCount: 9,
  },
];
