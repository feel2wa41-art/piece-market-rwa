import {create} from 'zustand';
import {SwapOffer} from '../types/swap';
import {MOCK_SWAP_OFFERS} from '../data/mockSwaps';

interface SwapState {
  offers: SwapOffer[];
  myOffers: SwapOffer[];

  loadMockOffers: () => void;
  createOffer: (offer: SwapOffer) => void;
  acceptOffer: (offerId: string) => void;
  cancelOffer: (offerId: string) => void;
  getOffersForAsset: (assetId: string) => SwapOffer[];
  getMatchingOffers: (ownedAssetIds: string[]) => SwapOffer[];
}

export const useSwapStore = create<SwapState>()((set, get) => ({
  offers: MOCK_SWAP_OFFERS,
  myOffers: [],

  loadMockOffers: () => set({offers: MOCK_SWAP_OFFERS}),

  createOffer: (offer: SwapOffer) => {
    set(state => ({myOffers: [offer, ...state.myOffers]}));
  },

  acceptOffer: (offerId: string) => {
    set(state => ({
      offers: state.offers.map(o =>
        o.id === offerId ? {...o, status: 'ACCEPTED' as const} : o,
      ),
    }));
  },

  cancelOffer: (offerId: string) => {
    set(state => ({
      myOffers: state.myOffers.map(o =>
        o.id === offerId ? {...o, status: 'CANCELLED' as const} : o,
      ),
    }));
  },

  getOffersForAsset: (assetId: string) => {
    return get().offers.filter(
      o => o.status === 'OPEN' && (o.offerAssetId === assetId || o.wantAssetId === assetId),
    );
  },

  getMatchingOffers: (ownedAssetIds: string[]) => {
    return get().offers.filter(
      o => o.status === 'OPEN' && ownedAssetIds.includes(o.wantAssetId),
    );
  },
}));
