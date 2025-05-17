import { ReactNode, useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter, 
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CloverWalletAdapter,
  CoinbaseWalletAdapter,
  BitKeepWalletAdapter,
  BitpieWalletAdapter,
  MathWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles for wallet components
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

// This component syncs the wallet public key with the window object
function WalletPublicKeySyncer() {
  const { publicKey, connected } = useWallet();
  
  useEffect(() => {
    if (connected && publicKey) {
      window.walletPublicKey = publicKey.toString();
      console.log("Wallet public key set in window object:", window.walletPublicKey);
    } else {
      window.walletPublicKey = undefined;
      console.log("Wallet public key cleared from window object");
    }
  }, [publicKey, connected]);
  
  return null;
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
  // Use Solana devnet by default (can be changed to mainnet)
  const network = WalletAdapterNetwork.Devnet;
  
  // You can use a custom RPC endpoint if needed
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  // @solana/wallet-adapter-wallets includes various wallet adapters
  // and a way to detect installed wallets in the user's browser
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new CloverWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new BitKeepWalletAdapter(),
      new BitpieWalletAdapter(),
      new MathWalletAdapter()
    ],
    [] // Fix dependency array - network is not used in wallet initialization
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletPublicKeySyncer />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
} 