// import {
//   users, wallets, socialAccounts, transactions, tokens,
//   type User, type InsertUser,
//   type Wallet, type InsertWallet,
//   type SocialAccount, type InsertSocialAccount,
//   type Transaction, type InsertTransaction,
//   type Token, type InsertToken
// } from "@shared/schema";

// export interface IStorage {
//   // User operations
//   getUser(id: number): Promise<User | undefined>;
//   getUserByUsername(username: string): Promise<User | undefined>;
//   createUser(user: InsertUser): Promise<User>;
  
//   // Wallet operations
//   getWallet(id: number): Promise<Wallet | undefined>;
//   getWalletByUserId(userId: number): Promise<Wallet | undefined>;
//   getWalletByAddress(address: string): Promise<Wallet | undefined>;
//   createWallet(wallet: InsertWallet): Promise<Wallet>;
//   updateWalletBalance(id: number, balance: string): Promise<Wallet | undefined>;
  
//   // Social account operations
//   getSocialAccount(id: number): Promise<SocialAccount | undefined>;
//   getSocialAccountsByUserId(userId: number): Promise<SocialAccount[]>;
//   getSocialAccountByPlatformAndUsername(platform: string, username: string): Promise<SocialAccount | undefined>;
//   createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
//   updateSocialAccountConnection(id: number, isConnected: boolean): Promise<SocialAccount | undefined>;
  
//   // Transaction operations
//   getTransaction(id: number): Promise<Transaction | undefined>;
//   getTransactionsByUserId(userId: number): Promise<Transaction[]>;
//   createTransaction(transaction: InsertTransaction): Promise<Transaction>;
//   updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
  
//   // Token operations
//   getToken(id: number): Promise<Token | undefined>;
//   getTokensByWalletId(walletId: number): Promise<Token[]>;
//   createToken(token: InsertToken): Promise<Token>;
//   updateTokenBalance(id: number, balance: string): Promise<Token | undefined>;
// }

// export class MemStorage implements IStorage {
//   private users: Map<number, User>;
//   private wallets: Map<number, Wallet>;
//   private socialAccounts: Map<number, SocialAccount>;
//   private transactions: Map<number, Transaction>;
//   private tokens: Map<number, Token>;
//   private userIdCounter: number;
//   private walletIdCounter: number;
//   private socialAccountIdCounter: number;
//   private transactionIdCounter: number;
//   private tokenIdCounter: number;

//   constructor() {
//     this.users = new Map();
//     this.wallets = new Map();
//     this.socialAccounts = new Map();
//     this.transactions = new Map();
//     this.tokens = new Map();
//     this.userIdCounter = 1;
//     this.walletIdCounter = 1;
//     this.socialAccountIdCounter = 1;
//     this.transactionIdCounter = 1;
//     this.tokenIdCounter = 1;
//   }

//   // User operations
//   async getUser(id: number): Promise<User | undefined> {
//     return this.users.get(id);
//   }

//   async getUserByUsername(username: string): Promise<User | undefined> {
//     return Array.from(this.users.values()).find(user => user.username === username);
//   }

//   async createUser(insertUser: InsertUser): Promise<User> {
//     const id = this.userIdCounter++;
//     const user: User = { ...insertUser, id };
//     this.users.set(id, user);
//     return user;
//   }

//   // Wallet operations
//   async getWallet(id: number): Promise<Wallet | undefined> {
//     return this.wallets.get(id);
//   }

//   async getWalletByUserId(userId: number): Promise<Wallet | undefined> {
//     return Array.from(this.wallets.values()).find(wallet => wallet.userId === userId);
//   }

//   async getWalletByAddress(address: string): Promise<Wallet | undefined> {
//     return Array.from(this.wallets.values()).find(wallet => wallet.address === address);
//   }

//   async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
//     const id = this.walletIdCounter++;
//     const now = new Date();
//     const wallet: Wallet = { ...insertWallet, id, createdAt: now };
//     this.wallets.set(id, wallet);
//     return wallet;
//   }

//   async updateWalletBalance(id: number, balance: string): Promise<Wallet | undefined> {
//     const wallet = this.wallets.get(id);
//     if (!wallet) return undefined;
    
//     wallet.balance = balance;
//     this.wallets.set(id, wallet);
//     return wallet;
//   }

//   // Social account operations
//   async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
//     return this.socialAccounts.get(id);
//   }

//   async getSocialAccountsByUserId(userId: number): Promise<SocialAccount[]> {
//     return Array.from(this.socialAccounts.values()).filter(account => account.userId === userId);
//   }

//   async getSocialAccountByPlatformAndUsername(platform: string, username: string): Promise<SocialAccount | undefined> {
//     return Array.from(this.socialAccounts.values()).find(
//       account => account.platform === platform && account.username === username
//     );
//   }

//   async createSocialAccount(insertAccount: InsertSocialAccount): Promise<SocialAccount> {
//     const id = this.socialAccountIdCounter++;
//     const now = new Date();
//     const account: SocialAccount = { ...insertAccount, id, connectedAt: now };
//     this.socialAccounts.set(id, account);
//     return account;
//   }

//   async updateSocialAccountConnection(id: number, isConnected: boolean): Promise<SocialAccount | undefined> {
//     const account = this.socialAccounts.get(id);
//     if (!account) return undefined;
    
//     account.isConnected = isConnected;
//     if (isConnected) {
//       account.connectedAt = new Date();
//     }
    
//     this.socialAccounts.set(id, account);
//     return account;
//   }

//   // Transaction operations
//   async getTransaction(id: number): Promise<Transaction | undefined> {
//     return this.transactions.get(id);
//   }

//   async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
//     return Array.from(this.transactions.values()).filter(
//       transaction => transaction.senderId === userId || transaction.receiverId === userId
//     );
//   }

//   async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
//     const id = this.transactionIdCounter++;
//     const now = new Date();
//     const transaction: Transaction = { ...insertTransaction, id, createdAt: now };
//     this.transactions.set(id, transaction);
//     return transaction;
//   }

//   async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
//     const transaction = this.transactions.get(id);
//     if (!transaction) return undefined;
    
//     transaction.status = status;
//     this.transactions.set(id, transaction);
//     return transaction;
//   }

//   // Token operations
//   async getToken(id: number): Promise<Token | undefined> {
//     return this.tokens.get(id);
//   }

//   async getTokensByWalletId(walletId: number): Promise<Token[]> {
//     return Array.from(this.tokens.values()).filter(token => token.walletId === walletId);
//   }

//   async createToken(insertToken: InsertToken): Promise<Token> {
//     const id = this.tokenIdCounter++;
//     const token: Token = { ...insertToken, id };
//     this.tokens.set(id, token);
//     return token;
//   }

//   async updateTokenBalance(id: number, balance: string): Promise<Token | undefined> {
//     const token = this.tokens.get(id);
//     if (!token) return undefined;
    
//     token.balance = balance;
//     this.tokens.set(id, token);
//     return token;
//   }
// }

// export const storage = new MemStorage();
