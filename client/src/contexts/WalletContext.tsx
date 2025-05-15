import { ReactNode, createContext, useState, useEffect } from "react";
import { Wallet, SocialAccount, TransactionItem } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

interface WalletContextType {
  wallet: Wallet | null;
  isConnected: boolean;
  connectWallet: (walletType: 'phantom' | 'solflare') => Promise<void>;
  disconnectWallet: () => void;
  createWallet: () => Promise<void>;
  socialAccounts: SocialAccount[];
  connectSocialAccount: (platform: string) => Promise<void>;
  disconnectSocialAccount: (platform: string) => Promise<void>;
  transactions: TransactionItem[];
  sendTip: (recipient: string, amount: number, platform: string, message?: string) => Promise<void>;
}

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  createWallet: async () => {},
  socialAccounts: [],
  connectSocialAccount: async () => {},
  disconnectSocialAccount: async () => {},
  transactions: [],
  sendTip: async () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  // Mock data for development, these would come from API calls in production
  const mockWallet: Wallet = {
    balance: 145.32,
    balanceUsd: 7265.00,
    address: "3Nj7dHjK8RLdJSTV6aK3BxKc2vF9x4c",
    type: "phantom",
    connectedSince: new Date("2023-05-10T16:32:00"),
    tokens: [
      {
        name: "Solana",
        symbol: "SOL",
        balance: 145.32,
        balanceUsd: 7265.00,
        isNative: true
      },
      {
        name: "USD Coin",
        symbol: "USDC",
        balance: 250,
        balanceUsd: 250,
        isNative: false
      }
    ]
  };

  const mockSocialAccounts: SocialAccount[] = [
    {
      platform: "twitter",
      username: "@soltipper",
      connectedAt: new Date("2023-05-10T12:00:00"),
      isConnected: true
    },
    {
      platform: "discord",
      username: "soltipper#1234",
      connectedAt: new Date("2023-05-11T10:00:00"),
      isConnected: true
    },
    {
      platform: "telegram",
      username: "",
      connectedAt: null,
      isConnected: false
    }
  ];

  const mockTransactions: TransactionItem[] = [
    {
      id: "tx1",
      type: "received",
      username: "@crypto_tipper",
      platform: "twitter",
      amount: 0.5,
      date: new Date("2023-05-15T10:32:00"),
      status: "confirmed",
      address: "3Nj7dH...F9x4c"
    },
    {
      id: "tx2",
      type: "sent",
      username: "@sol_enthusiast",
      platform: "discord",
      amount: 1.2,
      date: new Date("2023-05-14T16:15:00"),
      status: "confirmed",
      address: "7Yx8Zj...G3r2p"
    },
    {
      id: "tx3",
      type: "received",
      username: "@blockchain_dev",
      platform: "discord",
      amount: 2.5,
      date: new Date("2023-05-12T14:45:00"),
      status: "confirmed",
      address: "5Bg2Xd...H7t1m"
    },
    {
      id: "tx4",
      type: "sent",
      username: "@nft_creator",
      platform: "twitter",
      amount: 0.8,
      date: new Date("2023-05-11T11:22:00"),
      status: "confirmed",
      address: "2Kf9Pd...L5s8n"
    },
    {
      id: "tx5",
      type: "sent",
      username: "@solana_fan",
      platform: "telegram",
      amount: 5.0,
      date: new Date("2023-05-09T15:18:00"),
      status: "confirmed",
      address: "9Rt4Vh...N2q6s"
    }
  ];

  const connectWallet = async (walletType: 'phantom' | 'solflare') => {
    // In a real implementation, this would connect to a Solana wallet
    try {
      // Simulate API call to connect wallet
      // await apiRequest('POST', '/api/wallet/connect', { walletType });
      
      // For now, use the mock wallet data
      setWallet(mockWallet);
      setIsConnected(true);
      setSocialAccounts(mockSocialAccounts);
      setTransactions(mockTransactions);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return Promise.reject(error);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setIsConnected(false);
    setSocialAccounts([]);
    setTransactions([]);
  };

  const createWallet = async () => {
    try {
      // Simulate API call to create a new wallet
      // await apiRequest('POST', '/api/wallet/create');
      
      // For now, use the mock wallet data
      setWallet(mockWallet);
      setIsConnected(true);
      setSocialAccounts(mockSocialAccounts);
      setTransactions(mockTransactions);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating wallet:", error);
      return Promise.reject(error);
    }
  };

  const connectSocialAccount = async (platform: string) => {
    try {
      // Simulate API call to connect social account
      // await apiRequest('POST', '/api/social/connect', { platform });
      
      // Update local state
      setSocialAccounts(prevAccounts => 
        prevAccounts.map(account => 
          account.platform === platform 
            ? { ...account, isConnected: true, username: account.platform === 'telegram' ? '@soltipper_tg' : account.username } 
            : account
        )
      );
      
      return Promise.resolve();
    } catch (error) {
      console.error(`Error connecting ${platform} account:`, error);
      return Promise.reject(error);
    }
  };

  const disconnectSocialAccount = async (platform: string) => {
    try {
      // Simulate API call to disconnect social account
      // await apiRequest('POST', '/api/social/disconnect', { platform });
      
      // Update local state
      setSocialAccounts(prevAccounts => 
        prevAccounts.map(account => 
          account.platform === platform 
            ? { ...account, isConnected: false, username: '' } 
            : account
        )
      );
      
      return Promise.resolve();
    } catch (error) {
      console.error(`Error disconnecting ${platform} account:`, error);
      return Promise.reject(error);
    }
  };

  const sendTip = async (recipient: string, amount: number, platform: string, message?: string) => {
    try {
      // Simulate API call to send tip
      // await apiRequest('POST', '/api/transaction/send', { recipient, amount, platform, message });
      
      // Generate a new transaction and add it to the list
      const newTransaction: TransactionItem = {
        id: `tx${Date.now()}`,
        type: "sent",
        username: recipient,
        platform,
        amount,
        date: new Date(),
        status: "confirmed",
        address: "Randomized...Address",
        message
      };
      
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      
      // Update wallet balance
      if (wallet) {
        const newBalance = wallet.balance - amount;
        const newBalanceUsd = wallet.balanceUsd - (amount * (wallet.balanceUsd / wallet.balance));
        
        setWallet({
          ...wallet,
          balance: newBalance,
          balanceUsd: newBalanceUsd,
          tokens: wallet.tokens.map(token => 
            token.isNative 
              ? { ...token, balance: newBalance, balanceUsd: newBalanceUsd }
              : token
          )
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error sending tip:", error);
      return Promise.reject(error);
    }
  };

  return (
    <WalletContext.Provider value={{
      wallet,
      isConnected,
      connectWallet,
      disconnectWallet,
      createWallet,
      socialAccounts,
      connectSocialAccount,
      disconnectSocialAccount,
      transactions,
      sendTip
    }}>
      {children}
    </WalletContext.Provider>
  );
}
