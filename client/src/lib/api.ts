import { PublicKey } from "@solana/web3.js";

// Define platform types
export type PlatformType = "twitter" | "telegram" | "discord";

// Set up the API base URL using environment variables
const API_BASE_URL = "http://u4008kw840kcsgsc4kwgo448.34.67.137.207.sslip.io/api";
const API_KEY = "dev-key-1";

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
  // ✅ Set the API key header
  headers.set("x-api-key", API_KEY);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
};

// API error response type
interface ApiErrorResponse {
  message?: string;
}

// Type definitions
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

// Connection to a social platform
export interface PlatformConnection {
  platform: PlatformType;
  platformId: string;
  connected: boolean;
}

// User profile interface
export interface UserProfile {
  id: string;
  walletAddress: string;
  balance: number;
  connections: PlatformConnection[];
}

export interface UserProfileResponse {
  success: boolean;
  data: {

      id: string;
      publicKey: string;
      isCustodial: boolean;
      label?: string;
      createdAt: string;
      updatedAt: string;
    socialAccounts: Array<{
      platform: PlatformType;
      platformId: string;
      walletId: string;
      createdAt: string;
    }>;
    transactions: Transaction[]; // Last 5 transactions
  }
}

export interface SendSolParams {
  senderPlatform: PlatformType;
  senderPlatformId: string;
  recipientPlatform: PlatformType;
  recipientPlatformId: string;
  amount: number;
}

export interface SendSolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// API routes and methods
export const api = {
  // User-related endpoints
  user: {
    // Get user profile info
    getProfile: (walletAddress: string, limit?: number, offset?: number) =>
      apiRequest<UserProfile>(`/user/${walletAddress}?limit=${limit || 10}&offset=${offset || 0}`),
    
    // Get user profile by wallet address
    getProfileByWalletAddress: (walletAddress: string) =>
      apiRequest<UserProfileResponse>(`/user/profile/${walletAddress}`),

    // Get user by platform ID
    getByPlatformId: (platform: PlatformType, platformId: string) =>
      apiRequest<UserProfile>(`/user/platform/${platform}/${platformId}`),
    
    // Get wallet by social account (platform and username)
    getWalletBySocial: (platform: PlatformType, platformId: string) =>
      apiRequest<UserProfileResponse>(`/user/wallet/social?platform=${platform}&platformId=${platformId}`),

    // Create a new account for a wallet
    getOrCreateWallet: (walletAddress: string) =>
      apiRequest<UserProfile>("/user/wallet", {
        method: "POST",
        body: JSON.stringify({ walletAddress }),
      }),

    // Get a user's balance
    getBalance: (walletAddress: string) =>
      apiRequest<{ balance: number }>(`/user/${walletAddress}/balance`),

    // Get a user's social accounts
    getSocialAccounts: (walletAddress: string) =>
      apiRequest<{ accounts: PlatformConnection[] }>(`/user/${walletAddress}/social`),
    
    // Get a user's platform connections
    connections: (walletAddress: string) =>
      apiRequest<{ connections: PlatformConnection[] }>(`/user/${walletAddress}/connections`)
  },

  // SOL transaction endpoints
  sol: {
    // Send SOL to a user
    sendToUser: (params: {
      senderPlatform: PlatformType;
      senderPlatformId: string;
      recipientPlatform: PlatformType;
      recipientPlatformId: string;
      amount: number;
    }) =>
      apiRequest<SendSolResponse>("/sol/send", {
        method: "POST",
        body: JSON.stringify(params),
      }),

    // Get transaction history
    getTransactions: (walletAddress: string, limit = 10, offset = 0) =>
      apiRequest<{ transactions: Transaction[] }>(`/sol/transactions/${walletAddress}?limit=${limit}&offset=${offset}`),
  },

  // Platform connection endpoints
  platform: {
    // Connect a platform to user account
    connect: (platform: PlatformType, platformId: string) =>
      apiRequest<{ success: boolean }>("/platform/connect", {
        method: "POST",
        body: JSON.stringify({ platform, platformId }),
      }),

    // Disconnect a platform
    disconnect: (platform: PlatformType) =>
      apiRequest<{ success: boolean }>("/platform/disconnect", {
        method: "POST",
        body: JSON.stringify({ platform }),
      }),
  },
};

// // Helper function to send tip to a username on a platform
// export async function sendTipToUser(
//   platform: PlatformType,
//   username: string,
//   amount: number,
//   senderPublicKey: string
// ): Promise<{ recipientPublicKey: string }> {
//   // Get recipient's wallet by social username
//   const recipientWallet = await api.user.getByPlatformId(platform, username);
  
//   if (!recipientWallet) {
//     throw new Error(`No wallet found for @${username} on ${platform}`);
//   }
  
//   if (!recipientWallet.publicKey) {
//     throw new Error(`Recipient wallet doesn't have a valid public key`);
//   }
  
//   return {
//     recipientPublicKey: recipientWallet.publicKey,
//   };
// } 