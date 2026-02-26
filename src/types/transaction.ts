export type TransactionType = 'BUY' | 'SELL' | 'TRANSFER' | 'LISTING' | 'WITHDRAWAL';
export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface Transaction {
  id: string;
  type: TransactionType;
  userId?: string;
  assetId: string;
  assetTitle: string;
  fractionCount: number;
  pricePerFraction: number;
  totalAmount: number;
  fee: number;
  txHash?: string;
  status: TransactionStatus;
  createdAt: string;
}
