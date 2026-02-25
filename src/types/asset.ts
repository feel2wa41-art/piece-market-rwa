export type AssetStatus = 'PENDING' | 'ACTIVE' | 'SOLD';

export type AssetCategory =
  | 'POKEMON_CARDS'
  | 'KPOP_MERCH'
  | 'LUXURY_GOODS'
  | 'ART'
  | 'COLLECTIBLES'
  | 'OTHER';

export interface RWAAsset {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  imageUrl: string;
  category: AssetCategory;
  totalValue: number;
  fractionCount: number;
  unitPrice: number;
  soldFractions: number;
  status: AssetStatus;
  seller: {
    id: string;
    name: string;
    verified: boolean;
  };
  createdAt: string;
  metadata: {
    appraisalCertUrl?: string;
    condition?: string;
    storageLocation?: string;
  };
}
