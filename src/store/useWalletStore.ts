import {create} from 'zustand';

interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  setAddress: (address: string | null) => void;
  setBalance: (balance: string) => void;
  setConnected: (connected: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(set => ({
  address: null,
  balance: '0',
  isConnected: false,
  setAddress: address => set({address}),
  setBalance: balance => set({balance}),
  setConnected: isConnected => set({isConnected}),
  disconnect: () => set({address: null, balance: '0', isConnected: false}),
}));
