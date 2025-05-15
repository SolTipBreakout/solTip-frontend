import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { X } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connectWallet, createWallet } = useWallet();
  const { login, ready } = usePrivy();

  const handleConnect = async (walletType: 'phantom' | 'solflare') => {
    try {
      // For Privy, we'll just use their login system
      if (ready) {
        login();
      }
      
      // Also trigger our app's wallet connection for state management
      await connectWallet(walletType);
      onClose();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleCreateWallet = async () => {
    try {
      // With Privy, embedded wallet creation happens during login
      if (ready) {
        login();
      }
      
      await createWallet();
      onClose();
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="solana-card p-6 max-w-md w-full mx-4">
        <DialogHeader>
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-xl font-bold text-white">Connect Your Wallet</DialogTitle>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription className="text-gray-400 mb-6">
            Choose a wallet to connect to SolTip
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <button 
            onClick={() => handleConnect('phantom')}
            className="w-full py-3 px-4 gradient-button text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            <div className="w-6 h-6 rounded-full bg-[#9945FF]"></div>
            <span>Connect with Phantom</span>
          </button>
          
          <button 
            onClick={() => handleConnect('solflare')}
            className="w-full py-3 px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <div className="w-6 h-6 rounded-full bg-[#FC812B]"></div>
            <span>Connect with Solflare</span>
          </button>
          
          <div className="pt-4 border-t border-gray-700">
            <button 
              onClick={handleCreateWallet}
              className="w-full py-3 px-4 border border-gray-600 rounded-lg font-medium text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Create New Wallet
            </button>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <button 
            onClick={() => login()}
            className="w-full py-3 px-4 bg-[#14F195] text-black rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <span>Login with Social Account</span>
          </button>
        </div>
        
        <p className="mt-4 text-xs text-gray-400 text-center">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
        </p>
      </DialogContent>
    </Dialog>
  );
}
