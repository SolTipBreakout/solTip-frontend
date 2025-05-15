import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import ConnectWalletModal from "./ConnectWalletModal";
import { useWallet } from "@/hooks/useWallet";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected } = useWallet();

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (desktop) */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#1A1F2E] pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Mobile Navigation (Bottom Bar) */}
      <MobileNavigation />
      
      {/* Connect Wallet Modal */}
      <ConnectWalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
