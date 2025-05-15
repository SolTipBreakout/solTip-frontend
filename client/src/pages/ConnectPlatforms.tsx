import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { formatDate } from "@/lib/formatters";
import { useWallet } from "@/hooks/useWallet";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ConnectPlatforms() {
  const { isConnected } = useWallet();
  const { socialAccounts, connectSocialAccount, disconnectSocialAccount } = useSocialAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleConnect = async (platform: string) => {
    if (!isConnected) {
      setIsModalOpen(true);
      return;
    }

    try {
      await connectSocialAccount(platform);
      toast({
        title: "Account Connected",
        description: `Your ${platform} account has been connected successfully.`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect your ${platform} account. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      await disconnectSocialAccount(platform);
      toast({
        title: "Account Disconnected",
        description: `Your ${platform} account has been disconnected.`,
      });
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: `Failed to disconnect your ${platform} account. Please try again.`,
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Connect Social Platforms</h1>
          <p className="text-gray-500 dark:text-gray-400">Link your social media accounts to send and receive tips</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <i className="fas fa-link text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium mb-2">No wallet connected</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Connect your wallet first to link your social accounts.</p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 gradient-button text-white rounded-full"
          >
            Connect Wallet
          </button>
        </div>
        
        <ConnectWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Connect Social Platforms</h1>
        <p className="text-gray-500 dark:text-gray-400">Link your social media accounts to send and receive tips</p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Twitter Connection Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="p-6 md:flex items-start justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <i className="fab fa-twitter text-blue-400 text-2xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold">Twitter</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect your Twitter account to send and receive tips</p>
              </div>
            </div>
            
            {socialAccounts.find(a => a.platform === 'twitter')?.isConnected ? (
              <div className="flex flex-col items-end">
                <div className="text-xs px-2 py-1 mb-2 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Connected</div>
                <div className="text-sm">{socialAccounts.find(a => a.platform === 'twitter')?.username}</div>
              </div>
            ) : (
              <button
                onClick={() => handleConnect('twitter')}
                className="gradient-button px-6 py-2 text-white rounded-full mt-4 md:mt-0"
              >
                Connect
              </button>
            )}
          </div>
          
          {socialAccounts.find(a => a.platform === 'twitter')?.isConnected && (
            <div className="bg-gray-50 dark:bg-gray-750 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">
                  Connected on {formatDate(socialAccounts.find(a => a.platform === 'twitter')?.connectedAt || new Date())}
                </span>
              </div>
              <button
                onClick={() => handleDisconnect('twitter')}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
        
        {/* Discord Connection Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="p-6 md:flex items-start justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <i className="fab fa-discord text-indigo-500 text-2xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold">Discord</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect your Discord account to send and receive tips</p>
              </div>
            </div>
            
            {socialAccounts.find(a => a.platform === 'discord')?.isConnected ? (
              <div className="flex flex-col items-end">
                <div className="text-xs px-2 py-1 mb-2 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Connected</div>
                <div className="text-sm">{socialAccounts.find(a => a.platform === 'discord')?.username}</div>
              </div>
            ) : (
              <button
                onClick={() => handleConnect('discord')}
                className="gradient-button px-6 py-2 text-white rounded-full mt-4 md:mt-0"
              >
                Connect
              </button>
            )}
          </div>
          
          {socialAccounts.find(a => a.platform === 'discord')?.isConnected && (
            <div className="bg-gray-50 dark:bg-gray-750 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">
                  Connected on {formatDate(socialAccounts.find(a => a.platform === 'discord')?.connectedAt || new Date())}
                </span>
              </div>
              <button
                onClick={() => handleDisconnect('discord')}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
        
        {/* Telegram Connection Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="p-6 md:flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <i className="fab fa-telegram text-blue-500 text-2xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold">Telegram</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect your Telegram account to send and receive tips</p>
              </div>
            </div>
            
            {socialAccounts.find(a => a.platform === 'telegram')?.isConnected ? (
              <div className="flex flex-col items-end">
                <div className="text-xs px-2 py-1 mb-2 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Connected</div>
                <div className="text-sm">{socialAccounts.find(a => a.platform === 'telegram')?.username}</div>
              </div>
            ) : (
              <button
                onClick={() => handleConnect('telegram')}
                className="gradient-button px-6 py-2 text-white rounded-full mt-4 md:mt-0"
              >
                Connect
              </button>
            )}
          </div>
          
          {socialAccounts.find(a => a.platform === 'telegram')?.isConnected && (
            <div className="bg-gray-50 dark:bg-gray-750 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">
                  Connected on {formatDate(socialAccounts.find(a => a.platform === 'telegram')?.connectedAt || new Date())}
                </span>
              </div>
              <button
                onClick={() => handleDisconnect('telegram')}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
        
        {/* How It Works Section */}
        <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">How Platform Connections Work</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-[#9945FF]/10 text-[#9945FF]">
                <span className="font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Connect your social accounts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Link your Twitter, Discord, and Telegram accounts to SolTip</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-[#9945FF]/10 text-[#9945FF]">
                <span className="font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Receive SOL tips through your social accounts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Others can send you SOL by using your social handle</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-[#9945FF]/10 text-[#9945FF]">
                <span className="font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Send tips to anyone on connected platforms</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Send SOL to people even if they haven't signed up yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
