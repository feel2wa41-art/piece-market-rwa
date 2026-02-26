export type AssetStatus = 'PENDING' | 'ACTIVE' | 'SOLD';

export type AssetCategory =
  | 'POKEMON_CARDS'
  | 'KPOP_MERCH'
  | 'LUXURY_GOODS'
  | 'ART'
  | 'COLLECTIBLES'
  | 'MUSIC_RIGHTS'
  | 'OTHER';

export interface CustodyInfo {
  custodian: string;
  vaultId: string;
  location: string;
  verifiedAt: string;
  insuranceProvider: string;
  insuredValue: number;
  monitoring: 'CCTV_24H' | 'PERIODIC_AUDIT' | 'BOTH';
}

export interface OnChainProof {
  network: string;
  contractAddress: string;
  tokenStandard: string;
  explorerUrl: string;
}

export interface LegalRights {
  revenueShare: boolean;
  liquidationRights: boolean;
  governedBy: string;
  smartContractAuditor?: string;
}

export interface MusicRightsInfo {
  registrationNumber: string;
  registrar: string;
  copyrightHolder: string;
  performer: string;
  composer: string;
  lyricist?: string;
  aiAssisted: boolean;
  aiTool?: string;
  humanContribution: string;
  registeredAt: string;
  streamingPlatforms: string[];
  monthlyStreams?: number;
  annualRoyalty?: number;
}

export interface RWAAsset {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  imageUrl: string | number;
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
  custody?: CustodyInfo;
  onChainProof?: OnChainProof;
  legalRights?: LegalRights;
  musicRights?: MusicRightsInfo;
}
