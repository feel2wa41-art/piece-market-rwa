export interface AssetCollection {
  id: string;
  name: string;
  icon: string;
  assetIds: string[];
}

export interface SwapOffer {
  id: string;
  offerer: {
    id: string;
    name: string;
    avatar: string;
  };
  offerAssetId: string;
  offerFractions: number;
  wantAssetId: string;
  wantFractions: number;
  status: 'OPEN' | 'ACCEPTED' | 'CANCELLED' | 'EXPIRED';
  message?: string;
  createdAt: string;
  expiresAt?: string;
  demandCount: number; // how many people want this asset
}
