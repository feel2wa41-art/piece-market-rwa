import {FEE_RATES} from '../constants/fees';

// Simulated Base L2 gas fee (~$0.01)
export const ESTIMATED_GAS_USDC = 0.01;
// Actual gas cost on Base L2 (platform profit from gas markup)
export const ACTUAL_GAS_COST = 0.001;

export interface FeeBreakdown {
  itemPrice: number;
  serviceFee: number;
  gasFee: number;
  totalPayment: number;
}

export function calculateBuyFee(price: number): FeeBreakdown {
  const serviceFee = +(price * FEE_RATES.BUY).toFixed(2);
  const gasFee = ESTIMATED_GAS_USDC;
  return {
    itemPrice: price,
    serviceFee,
    gasFee,
    totalPayment: +(price + serviceFee + gasFee).toFixed(2),
  };
}

export function calculateSellFee(price: number): FeeBreakdown {
  const serviceFee = +(price * FEE_RATES.SELL).toFixed(2);
  const gasFee = ESTIMATED_GAS_USDC;
  return {
    itemPrice: price,
    serviceFee,
    gasFee,
    totalPayment: +(price - serviceFee - gasFee).toFixed(2),
  };
}

export function calculateListingFee(totalValue: number): number {
  return +(totalValue * FEE_RATES.LISTING).toFixed(2);
}
