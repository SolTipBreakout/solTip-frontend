import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  address: text("address").notNull().unique(),
  balance: text("balance").notNull().default("0"),
  type: text("type").notNull(), // phantom, solflare, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // twitter, discord, telegram
  username: text("username").notNull(),
  isConnected: boolean("is_connected").notNull().default(true),
  connectedAt: timestamp("connected_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // sent, received
  senderId: integer("sender_id").references(() => users.id),
  receiverId: integer("receiver_id").references(() => users.id),
  amount: text("amount").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, failed
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  balance: text("balance").notNull().default("0"),
  isNative: boolean("is_native").notNull().default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
  address: true,
  balance: true,
  type: true,
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).pick({
  userId: true,
  platform: true,
  username: true,
  isConnected: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  type: true,
  senderId: true,
  receiverId: true,
  amount: true,
  platform: true,
  status: true,
  message: true,
});

export const insertTokenSchema = createInsertSchema(tokens).pick({
  walletId: true,
  name: true,
  symbol: true,
  balance: true,
  isNative: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;

export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertToken = z.infer<typeof insertTokenSchema>;
export type Token = typeof tokens.$inferSelect;
