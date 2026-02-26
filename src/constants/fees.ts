export const FEE_RATES = {
  BUY: 0.03,
  SELL: 0.02,
  LISTING: 0.05,
  SWAP: 0.015, // 1.5% each side → 3% total (vs 5% for sell+buy)
} as const;
