import { PublicKey } from "@solana/web3.js";

const API_BASE_URL = "/api";//TODO update with mcpurl

declare global {
  interface Window {
    walletPublicKey?: string;
  }
}

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API request with auth token
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options.headers || {}),
  });

  if (window.walletPublicKey) {
    headers.set("Authorization", `Bearer ${window.walletPublicKey}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
};

// Type definitions
export type PlatformType = "twitter" | "discord" | "telegram";
export type TransactionStatus = "pending" | "confirmed" | "failed";
export type TransactionType = "tip" | "withdrawal" | "deposit";

export interface Platform {
  type: PlatformType;
  username: string;
  connected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  publicKey: string;
  isCustodial: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  signature: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  tokenSymbol: string;
  senderWalletId: string;
  recipientAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  wallet: Wallet;
  platforms: Platform[];
  transactions: Transaction[];
}

export interface ConnectPlatformData {
  platform: PlatformType;
  username: string;
}

export interface CreateWalletData {
  publicKey: string;
}

export interface GetWalletBySocialData {
  platform: PlatformType;
  username: string;
}

// API client functions
export const api = {
  user: {
    getProfile: (walletAddress: string, limit?: number, offset?: number) =>
      apiRequest<UserProfile>(`/user/${walletAddress}?limit=${limit || 10}&offset=${offset || 0}`),
    
    getWalletBySocial: (platform: PlatformType, username: string) =>
      apiRequest<Wallet>(`/user/wallet/${platform}/${username}`),
    
    getOrCreateWallet: (data: CreateWalletData) =>
      apiRequest<Wallet>("/user/wallet", {
        method: "POST",
        body: JSON.stringify({ publicKey: data.publicKey }),
      }),
    
    linkWallet: (data: { platform: PlatformType; platformId: string; walletPublicKey: string }) => 
      apiRequest<Wallet>("/user/wallet/link", {
        method: "POST",
        body: JSON.stringify(data)
      }),
    
    unlinkWallet: (platform: PlatformType) =>
      apiRequest<{ success: boolean }>(`/user/wallet/unlink?platform=${platform}`, {
        method: "DELETE"
      }),
    
    getSocialAccounts: (walletAddress: string) => 
      apiRequest<Platform[]>(`/user/social-accounts/${walletAddress}`)
  },
  
  platform: {
    connect: (platform: PlatformType, username: string) =>
      apiRequest<Platform>("/platform/connect", {
        method: "POST",
        body: JSON.stringify({ platform, username } satisfies ConnectPlatformData),
      }),
    
    disconnect: (platform: PlatformType) =>
      apiRequest<Platform>(`/platform/disconnect/${platform}`, {
        method: "POST",
      }),
  },
  
  transaction: {
    record: (data: {
      signature: string;
      senderWalletId: string;
      recipientAddress: string;
      amount: number;
      tokenSymbol: string;
      status: TransactionStatus;
    }) =>
      apiRequest<Transaction>("/transaction", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    
    updateStatus: (signature: string, data: { status: TransactionStatus }) =>
      apiRequest<Transaction>(`/transaction/${signature}/status`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  }
};

// Helper function to send tip to a username on a platform
export async function sendTipToUser(
  platform: PlatformType,
  username: string,
  amount: number,
  senderPublicKey: string
): Promise<{ recipientPublicKey: string }> {
  // Get recipient's wallet by social username
  const recipientWallet = await api.user.getWalletBySocial(platform, username);
  
  if (!recipientWallet) {
    throw new Error(`No wallet found for @${username} on ${platform}`);
  }
  
  if (!recipientWallet.publicKey) {
    throw new Error(`Recipient wallet doesn't have a valid public key`);
  }
  
  return {
    recipientPublicKey: recipientWallet.publicKey,
  };
} 