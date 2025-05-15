import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import ThemeToggle from "@/components/ThemeToggle";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import { formatSOL, formatCurrency, formatDateTime } from "@/lib/formatters";

export default function Dashboard() {
  const { wallet, isConnected, transactions } = useWallet();
  const { connectedPlatforms } = useSocialAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"></div>
          <h1 className="text-xl font-bold">SolTip</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full bg-white dark:bg-gray-800 shadow">
            <ThemeToggle />
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to SolTip</h1>
            <p className="text-white/80">Send SOL tips effortlessly across social platforms</p>
          </div>
          {/* Wallet Connection Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`mt-4 md:mt-0 px-6 py-3 ${isConnected ? 'bg-green-500 text-white' : 'bg-white text-[#9945FF]'} rounded-full font-medium shadow-lg hover:shadow-xl transition-all`}
          >
            {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
        </div>
      </div>

      {/* Connected Wallet Section */}
      {isConnected && wallet ? (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Wallet Balance</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Connected</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-[#9945FF]/10 dark:bg-[#9945FF]/20">
                <i className="fas fa-wallet text-[#9945FF]"></i>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatSOL(wallet.balance)}</p>
                <p className="text-gray-500 dark:text-gray-400">{formatCurrency(wallet.balanceUsd)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Wallet</span>
                <span className="truncate max-w-[150px]">{wallet.address}</span>
              </div>
            </div>
          </div>

          {/* Connected Platforms Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-lg font-medium mb-4">Connected Platforms</h2>
            <div className="space-y-3">
              {connectedPlatforms.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${platform.platform === 'twitter' ? 'bg-blue-100 dark:bg-blue-900 text-blue-500' : 
                      platform.platform === 'discord' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-500' : 
                      'bg-blue-100 dark:bg-blue-900 text-blue-500'}`}>
                      <i className={`fab fa-${platform.platform}`}></i>
                    </div>
                    <span className="capitalize">{platform.platform}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {platform.username}
                  </span>
                </div>
              ))}
              
              {/* Disconnected platform example */}
              {!connectedPlatforms.some(p => p.platform === 'telegram') && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500">
                      <i className="fab fa-telegram"></i>
                    </div>
                    <span>Telegram</span>
                  </div>
                  <button className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Connect
                  </button>
                </div>
              )}
            </div>
            <Link href="/connect">
              <a className="w-full block mt-4 py-2 text-center text-sm text-[#9945FF] border border-[#9945FF] rounded-lg hover:bg-[#9945FF]/10 transition-colors">
                Manage Connections
              </a>
            </Link>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/send">
                <a className="p-4 rounded-lg bg-[#9945FF]/10 dark:bg-[#9945FF]/20 hover:bg-[#9945FF]/20 dark:hover:bg-[#9945FF]/30 transition-colors text-center">
                  <i className="fas fa-paper-plane text-[#9945FF] mb-2"></i>
                  <span className="block text-sm font-medium">Send Tip</span>
                </a>
              </Link>
              <Link href="/wallet">
                <a className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center">
                  <i className="fas fa-qrcode mb-2"></i>
                  <span className="block text-sm font-medium">Receive</span>
                </a>
              </Link>
              <Link href="/transactions">
                <a className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center">
                  <i className="fas fa-history mb-2"></i>
                  <span className="block text-sm font-medium">History</span>
                </a>
              </Link>
              <button className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center">
                <i className="fas fa-cog mb-2"></i>
                <span className="block text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Recent Transactions Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <Link href="/transactions">
            <a className="text-[#9945FF] hover:underline">View All</a>
          </Link>
        </div>
        
        {/* Placeholder for when no wallet is connected */}
        {!isConnected ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <i className="fas fa-exchange-alt text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to see your transaction history</p>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="px-6 py-2 text-sm gradient-button text-white rounded-full"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${transaction.type === 'received' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'}`}>
                    <i className={`fas fa-arrow-${transaction.type === 'received' ? 'down' : 'up'}`}></i>
                  </div>
                  <div>
                    <p className="font-medium">{transaction.type === 'received' ? `Received from ${transaction.username}` : `Sent to ${transaction.username}`}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === 'received' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {transaction.type === 'received' ? '+' : '-'}{transaction.amount} SOL
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{transaction.platform}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConnectWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
