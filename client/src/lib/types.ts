// Wallet types
export interface Token {
  name: string;
  symbol: string;
  balance: number;
  balanceUsd: number;
  isNative: boolean;
}

export interface Wallet {
  balance: number;
  balanceUsd: number;
  address: string;
  type: "phantom" | "solflare" | "other";
  connectedSince: Date;
  tokens: Token[];
}

// Social account types
export interface SocialAccount {
  platform: string;
  username: string;
  connectedAt: Date | null;
  isConnected: boolean;
}

// Transaction types
export interface TransactionItem {
  id: string;
  type: "sent" | "received";
  username: string;
  platform: string;
  amount: number;
  date: Date;
  status: "pending" | "confirmed" | "failed";
  address: string;
  message?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
