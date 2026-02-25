export type TransactionType = 'BUY' | 'SELL' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface Transaction {
  id: string;
  type: TransactionType;
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
