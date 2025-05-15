import { Link, useLocation } from "wouter";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-black/95 border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"></div>
            <h1 className="text-xl font-bold text-white">SolTip</h1>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        <Link href="/">
          <div className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${isActive("/") 
            ? "bg-[#1E1E1E] font-medium text-white" 
            : "text-gray-300 hover:bg-[#1E1E1E] hover:text-white transition-colors"}`}>
            <i className={`fas fa-th-large ${isActive("/") ? "text-[#14F195]" : ""}`}></i>
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/send">
          <div className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${isActive("/send") 
            ? "bg-[#1E1E1E] font-medium text-white" 
            : "text-gray-300 hover:bg-[#1E1E1E] hover:text-white transition-colors"}`}>
            <i className={`fas fa-paper-plane ${isActive("/send") ? "text-[#14F195]" : ""}`}></i>
            <span>Send Tip</span>
          </div>
        </Link>
        <Link href="/wallet">
          <div className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${isActive("/wallet") 
            ? "bg-[#1E1E1E] font-medium text-white" 
            : "text-gray-300 hover:bg-[#1E1E1E] hover:text-white transition-colors"}`}>
            <i className={`fas fa-wallet ${isActive("/wallet") ? "text-[#14F195]" : ""}`}></i>
            <span>Wallet</span>
          </div>
        </Link>
        <Link href="/transactions">
          <div className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${isActive("/transactions") 
            ? "bg-[#1E1E1E] font-medium text-white" 
            : "text-gray-300 hover:bg-[#1E1E1E] hover:text-white transition-colors"}`}>
            <i className={`fas fa-exchange-alt ${isActive("/transactions") ? "text-[#14F195]" : ""}`}></i>
            <span>Transactions</span>
          </div>
        </Link>
        <Link href="/connect">
          <div className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${isActive("/connect") 
            ? "bg-[#1E1E1E] font-medium text-white" 
            : "text-gray-300 hover:bg-[#1E1E1E] hover:text-white transition-colors"}`}>
            <i className={`fas fa-link ${isActive("/connect") ? "text-[#14F195]" : ""}`}></i>
            <span>Connect Accounts</span>
          </div>
        </Link>
      </nav>
      
      {/* Theme Toggle (Desktop) */}
      <div className="mt-auto p-4 border-t border-gray-800">
        <ThemeToggle />
      </div>
    </aside>
  );
}
