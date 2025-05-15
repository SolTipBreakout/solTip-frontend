import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import { formatAddress, formatSOL, formatCurrency, formatDate, formatTime } from "@/lib/formatters";

export default function WalletManagement() {
  const { wallet, isConnected, disconnectWallet } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleDisconnect = () => {
    disconnectWallet();
    setShowQRCode(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Wallet Management</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage your wallet details</p>
      </div>
      
      {/* Wallet Not Connected State */}
      {!isConnected ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <i className="fas fa-wallet text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium mb-2">No wallet connected</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Connect your wallet to manage your funds and send tips.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 px-4 gradient-button text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <div className="w-6 h-6 rounded-full bg-[#9945FF]"></div>
              <span>Connect with Phantom</span>
            </button>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
            >
              <div className="w-6 h-6 rounded-full bg-[#FC812B]"></div>
              <span>Connect with Solflare</span>
            </button>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                Create New Wallet
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Wallet Overview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Wallet Overview</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Connected</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Balance</p>
                  <p className="text-2xl font-bold">{formatSOL(wallet?.balance || 0)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(wallet?.balanceUsd || 0)}</p>
                </div>
                
                {/* Wallet Address */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wallet Address</p>
                  <div className="flex items-center space-x-2">
                    <p className="truncate max-w-[150px]">{formatAddress(wallet?.address || '')}</p>
                    <button 
                      className="text-[#9945FF]" 
                      title="Copy Address"
                      onClick={() => {
                        if (wallet?.address) {
                          navigator.clipboard.writeText(wallet.address);
                        }
                      }}
                    >
                      <i className="far fa-copy"></i>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{wallet?.type || ''} Wallet</p>
                </div>
                
                {/* Connected Since */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Connected Since</p>
                  <p className="font-medium">{wallet?.connectedSince ? formatDate(wallet.connectedSince) : ''}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{wallet?.connectedSince ? formatTime(wallet.connectedSince) : ''}</p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 p-3 bg-gray-50 dark:bg-gray-750">
              <button 
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => window.location.href = '/send'}
              >
                <i className="fas fa-paper-plane mb-1"></i>
                <span className="text-xs">Send</span>
              </button>
              <button 
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowQRCode(true)}
              >
                <i className="fas fa-qrcode mb-1"></i>
                <span className="text-xs">Receive</span>
              </button>
              <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <i className="fas fa-exchange-alt mb-1"></i>
                <span className="text-xs">Swap</span>
              </button>
              <button 
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleDisconnect}
              >
                <i className="fas fa-sign-out-alt mb-1"></i>
                <span className="text-xs">Disconnect</span>
              </button>
            </div>
          </div>
          
          {/* Token Holdings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Token Holdings</h2>
            
            <div className="space-y-4">
              {wallet?.tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${token.isNative ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195]' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'}`}>
                      <span className="text-white font-bold">{token.symbol}</span>
                    </div>
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{token.isNative ? 'Native Token' : 'SPL Token'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{token.balance} {token.symbol}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(token.balanceUsd)}</p>
                  </div>
                </div>
              ))}
              
              {/* Add Token Button */}
              <button className="w-full py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <i className="fas fa-plus mr-2"></i> Add Custom Token
              </button>
            </div>
          </div>
          
          {/* QR Code for Receiving */}
          {showQRCode && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
              <h2 className="text-xl font-bold mb-4">Receive SOL</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Share this QR code to receive SOL tips directly to your wallet</p>
              
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                {/* Generate QR Code with wallet address */}
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Simplified QR code SVG representation */}
                    <rect width="200" height="200" fill="white" />
                    <rect x="40" y="40" width="120" height="120" fill="#000" />
                    <rect x="55" y="55" width="90" height="90" fill="#fff" />
                    <rect x="70" y="70" width="60" height="60" fill="#000" />
                    <rect x="85" y="85" width="30" height="30" fill="#fff" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <p className="truncate max-w-[200px] text-sm">{wallet?.address}</p>
                <button 
                  className="text-[#9945FF]" 
                  title="Copy Address"
                  onClick={() => {
                    if (wallet?.address) {
                      navigator.clipboard.writeText(wallet.address);
                    }
                  }}
                >
                  <i className="far fa-copy"></i>
                </button>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <i className="fas fa-share-alt mr-2"></i> Share
                </button>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <i className="fas fa-download mr-2"></i> Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConnectWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
