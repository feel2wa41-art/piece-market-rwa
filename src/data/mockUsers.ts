import {User} from '../types/user';

export const DEMO_USERS: User[] = [
  {
    id: 'investor-1',
    email: 'investor@piecemarket.io',
    displayName: 'Alex Kim',
    role: 'INVESTOR',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    isVerified: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'seller-1',
    email: 'seller@piecemarket.io',
    displayName: 'Sarah Park',
    role: 'SELLER',
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    isVerified: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@piecemarket.io',
    displayName: 'Admin',
    role: 'ADMIN',
    walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
    isVerified: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export const getDemoUser = (id: string) => DEMO_USERS.find(u => u.id === id);
