import {FEE_RATES} from '../constants/fees';

export interface FeeBreakdown {
  itemPrice: number;
  serviceFee: number;
  totalPayment: number;
}

export function calculateBuyFee(price: number): FeeBreakdown {
  const fee = price * FEE_RATES.BUY;
  return {
    itemPrice: price,
    serviceFee: Math.round(fee),
    totalPayment: price + Math.round(fee),
  };
}

export function calculateSellFee(price: number): FeeBreakdown {
  const fee = price * FEE_RATES.SELL;
  return {
    itemPrice: price,
    serviceFee: Math.round(fee),
    totalPayment: price - Math.round(fee),
  };
}
