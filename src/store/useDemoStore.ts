import {create} from 'zustand';
import {Transaction} from '../types/transaction';
import {FEE_RATES} from '../constants/fees';

interface DemoState {
  // Platform revenue tracking
  totalBuyFees: number;
  totalSellFees: number;
  totalListingFees: number;
  totalTransactions: number;
  allTransactions: Transaction[];

  // Actions
  recordTransaction: (tx: Transaction) => void;
  getTotalRevenue: () => number;
  getRevenueBreakdown: () => {buy: number; sell: number; listing: number};
  withdrawRevenue: (amount: number) => void;
  withdrawnAmount: number;
}

export const useDemoStore = create<DemoState>()((set, get) => ({
  totalBuyFees: 85.75,
  totalSellFees: 0,
  totalListingFees: 21000,
  totalTransactions: 4,
  allTransactions: [],
  withdrawnAmount: 0,

  recordTransaction: (tx: Transaction) =>
    set(state => {
      let buyFees = state.totalBuyFees;
      let sellFees = state.totalSellFees;
      let listingFees = state.totalListingFees;

      if (tx.type === 'BUY') buyFees += tx.fee;
      else if (tx.type === 'SELL') sellFees += tx.fee;
      else if (tx.type === 'LISTING') listingFees += tx.fee;

      return {
        totalBuyFees: buyFees,
        totalSellFees: sellFees,
        totalListingFees: listingFees,
        totalTransactions: state.totalTransactions + 1,
        allTransactions: [tx, ...state.allTransactions],
      };
    }),

  getTotalRevenue: () => {
    const s = get();
    return s.totalBuyFees + s.totalSellFees + s.totalListingFees - s.withdrawnAmount;
  },

  getRevenueBreakdown: () => {
    const s = get();
    return {
      buy: s.totalBuyFees,
      sell: s.totalSellFees,
      listing: s.totalListingFees,
    };
  },

  withdrawRevenue: (amount: number) =>
    set(state => ({
      withdrawnAmount: state.withdrawnAmount + amount,
    })),
}));
