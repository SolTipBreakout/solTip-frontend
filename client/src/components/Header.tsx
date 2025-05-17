import { Link } from 'react-router-dom';
import { Home, Send, Link as LinkIcon } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export function Header() {
  const { connected } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-900/20 bg-black/50 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="text-purple-400 text-xl">
              SolTipConnect
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-white hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              to="/send" 
              className="text-sm font-medium text-white hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              Send Tip
            </Link>
            <Link 
              to="/connect" 
              className="text-sm font-medium text-white hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <LinkIcon className="w-4 h-4" />
              Connect Platforms
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md" />
        </div>
      </div>
    </header>
  );
} 