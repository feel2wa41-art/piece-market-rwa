export type UserRole = 'INVESTOR' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  role: UserRole;
  walletAddress: string;
  isVerified: boolean;
  createdAt: string;
}
