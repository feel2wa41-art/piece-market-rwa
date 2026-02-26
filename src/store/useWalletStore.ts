import {create} from 'zustand';
import {Transaction} from '../types/transaction';

interface WalletState {
  address: string | null;
  balance: number; // USDC balance
  isConnected: boolean;
  transactions: Transaction[];

  setAddress: (address: string | null) => void;
  setBalance: (balance: number) => void;
  setConnected: (connected: boolean) => void;
  disconnect: () => void;
  deductBalance: (amount: number) => boolean;
  addBalance: (amount: number) => void;
  addTransaction: (tx: Transaction) => void;
  initForUser: (address: string) => void;
}

const DEFAULT_USDC_BALANCE = 5000; // 5,000 USDC demo balance

export const useWalletStore = create<WalletState>()((set, get) => ({
  address: null,
  balance: DEFAULT_USDC_BALANCE,
  isConnected: false,
  transactions: [],

  setAddress: address => set({address}),
  setBalance: balance => set({balance}),
  setConnected: isConnected => set({isConnected}),
  disconnect: () => set({address: null, balance: 0, isConnected: false, transactions: []}),

  deductBalance: (amount: number) => {
    const current = get().balance;
    if (current < amount) return false;
    set({balance: +(current - amount).toFixed(2)});
    return true;
  },

  addBalance: (amount: number) => {
    set(state => ({balance: +(state.balance + amount).toFixed(2)}));
  },

  addTransaction: (tx: Transaction) => {
    set(state => ({transactions: [tx, ...state.transactions]}));
  },

  initForUser: (address: string) => {
    set({
      address,
      balance: DEFAULT_USDC_BALANCE,
      isConnected: true,
      transactions: [],
    });
  },
}));
