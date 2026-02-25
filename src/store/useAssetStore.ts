import {create} from 'zustand';
import {RWAAsset} from '../types/asset';

interface AssetState {
  assets: RWAAsset[];
  featuredAssets: RWAAsset[];
  isLoading: boolean;
  error: string | null;
  setAssets: (assets: RWAAsset[]) => void;
  setFeaturedAssets: (assets: RWAAsset[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAssetStore = create<AssetState>()(set => ({
  assets: [],
  featuredAssets: [],
  isLoading: false,
  error: null,
  setAssets: assets => set({assets}),
  setFeaturedAssets: assets => set({featuredAssets: assets}),
  setLoading: isLoading => set({isLoading}),
  setError: error => set({error}),
}));
