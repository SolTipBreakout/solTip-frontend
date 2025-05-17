import { Link } from 'react-router-dom';
import { Home, Send, Link as LinkIcon } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export function Header() {
  const { connected } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              SolTipConnect
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              to="/send" 
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              Send Tip
            </Link>
            <Link 
              to="/connect" 
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              <LinkIcon className="w-4 h-4" />
              Connect Platforms
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <WalletMultiButton className="bg-primary hover:bg-primary/90 text-white rounded-md" />
        </div>
      </div>
    </header>
  );
} 