import {create} from 'zustand';
import {RWAAsset} from '../types/asset';
import {MOCK_ASSETS} from '../data/mockAssets';

export interface PortfolioItem {
  asset: RWAAsset;
  ownedFractions: number;
}

interface AssetState {
  assets: RWAAsset[];
  featuredAssets: RWAAsset[];
  portfolio: PortfolioItem[];
  isLoading: boolean;
  error: string | null;

  setAssets: (assets: RWAAsset[]) => void;
  setFeaturedAssets: (assets: RWAAsset[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadMockData: () => void;
  purchaseFractions: (assetId: string, quantity: number) => boolean;
  addAsset: (asset: RWAAsset) => void;
  getPortfolioValue: () => number;
  seedDemoPortfolio: () => void;
  swapFractions: (giveAssetId: string, giveFractions: number, receiveAssetId: string, receiveFractions: number) => boolean;
}

export const useAssetStore = create<AssetState>()((set, get) => ({
  assets: MOCK_ASSETS,
  featuredAssets: MOCK_ASSETS.slice(0, 4),
  portfolio: [],
  isLoading: false,
  error: null,

  setAssets: assets => set({assets}),
  setFeaturedAssets: assets => set({featuredAssets: assets}),
  setLoading: isLoading => set({isLoading}),
  setError: error => set({error}),

  loadMockData: () => {
    set({
      assets: MOCK_ASSETS,
      featuredAssets: MOCK_ASSETS.slice(0, 4),
    });
  },

  purchaseFractions: (assetId: string, quantity: number) => {
    const state = get();
    const assetIndex = state.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return false;

    const asset = state.assets[assetIndex];
    const available = asset.fractionCount - asset.soldFractions;
    if (quantity > available) return false;

    // Update sold fractions in assets list
    const updatedAssets = [...state.assets];
    updatedAssets[assetIndex] = {
      ...asset,
      soldFractions: asset.soldFractions + quantity,
    };

    // Update portfolio
    const existingIdx = state.portfolio.findIndex(p => p.asset.id === assetId);
    const updatedPortfolio = [...state.portfolio];
    if (existingIdx >= 0) {
      updatedPortfolio[existingIdx] = {
        asset: updatedAssets[assetIndex],
        ownedFractions: updatedPortfolio[existingIdx].ownedFractions + quantity,
      };
    } else {
      updatedPortfolio.push({
        asset: updatedAssets[assetIndex],
        ownedFractions: quantity,
      });
    }

    set({
      assets: updatedAssets,
      featuredAssets: updatedAssets.slice(0, 4),
      portfolio: updatedPortfolio,
    });
    return true;
  },

  addAsset: (asset: RWAAsset) => {
    set(state => ({
      assets: [...state.assets, asset],
    }));
  },

  getPortfolioValue: () => {
    return get().portfolio.reduce(
      (sum, item) => sum + item.ownedFractions * item.asset.unitPrice,
      0,
    );
  },

  seedDemoPortfolio: () => {
    const state = get();
    if (state.portfolio.length > 0) return; // already seeded

    // Give demo investor some fractions so swap feature is immediately usable
    const seeds = [
      {assetId: '1', fractions: 5},  // Charizard — Pokemon 1/2
      {assetId: '2', fractions: 4},  // BTS — K-Pop 1/2
    ];

    const updatedAssets = [...state.assets];
    const newPortfolio: PortfolioItem[] = [];

    for (const seed of seeds) {
      const idx = updatedAssets.findIndex(a => a.id === seed.assetId);
      if (idx === -1) continue;
      updatedAssets[idx] = {
        ...updatedAssets[idx],
        soldFractions: updatedAssets[idx].soldFractions + seed.fractions,
      };
      newPortfolio.push({
        asset: updatedAssets[idx],
        ownedFractions: seed.fractions,
      });
    }

    set({
      assets: updatedAssets,
      featuredAssets: updatedAssets.slice(0, 4),
      portfolio: newPortfolio,
    });
  },

  swapFractions: (giveAssetId, giveFractions, receiveAssetId, receiveFractions) => {
    const state = get();

    // Check user owns enough
    const giveItem = state.portfolio.find(p => p.asset.id === giveAssetId);
    if (!giveItem || giveItem.ownedFractions < giveFractions) return false;

    const updatedPortfolio = state.portfolio
      .map(p => {
        if (p.asset.id === giveAssetId) {
          return {...p, ownedFractions: p.ownedFractions - giveFractions};
        }
        return p;
      })
      .filter(p => p.ownedFractions > 0);

    // Add received fractions
    const receiveAsset = state.assets.find(a => a.id === receiveAssetId);
    if (!receiveAsset) return false;

    const existingReceive = updatedPortfolio.findIndex(p => p.asset.id === receiveAssetId);
    if (existingReceive >= 0) {
      updatedPortfolio[existingReceive] = {
        ...updatedPortfolio[existingReceive],
        ownedFractions: updatedPortfolio[existingReceive].ownedFractions + receiveFractions,
      };
    } else {
      updatedPortfolio.push({asset: receiveAsset, ownedFractions: receiveFractions});
    }

    set({portfolio: updatedPortfolio});
    return true;
  },
}));
