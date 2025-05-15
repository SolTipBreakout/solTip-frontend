import { Link, useLocation } from "wouter";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"></div>
            <h1 className="text-xl font-bold">SolTip</h1>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        <Link href="/">
          <a className={`flex items-center space-x-2 p-2 rounded-lg ${isActive("/") 
            ? "bg-gray-100 dark:bg-gray-800 font-medium" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"}`}>
            <i className={`fas fa-th-large ${isActive("/") ? "text-[#9945FF]" : ""}`}></i>
            <span>Dashboard</span>
          </a>
        </Link>
        <Link href="/send">
          <a className={`flex items-center space-x-2 p-2 rounded-lg ${isActive("/send") 
            ? "bg-gray-100 dark:bg-gray-800 font-medium" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"}`}>
            <i className={`fas fa-paper-plane ${isActive("/send") ? "text-[#9945FF]" : ""}`}></i>
            <span>Send Tip</span>
          </a>
        </Link>
        <Link href="/wallet">
          <a className={`flex items-center space-x-2 p-2 rounded-lg ${isActive("/wallet") 
            ? "bg-gray-100 dark:bg-gray-800 font-medium" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"}`}>
            <i className={`fas fa-wallet ${isActive("/wallet") ? "text-[#9945FF]" : ""}`}></i>
            <span>Wallet</span>
          </a>
        </Link>
        <Link href="/transactions">
          <a className={`flex items-center space-x-2 p-2 rounded-lg ${isActive("/transactions") 
            ? "bg-gray-100 dark:bg-gray-800 font-medium" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"}`}>
            <i className={`fas fa-exchange-alt ${isActive("/transactions") ? "text-[#9945FF]" : ""}`}></i>
            <span>Transactions</span>
          </a>
        </Link>
        <Link href="/connect">
          <a className={`flex items-center space-x-2 p-2 rounded-lg ${isActive("/connect") 
            ? "bg-gray-100 dark:bg-gray-800 font-medium" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"}`}>
            <i className={`fas fa-link ${isActive("/connect") ? "text-[#9945FF]" : ""}`}></i>
            <span>Connect Accounts</span>
          </a>
        </Link>
      </nav>
      
      {/* Theme Toggle (Desktop) */}
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
        <ThemeToggle />
      </div>
    </aside>
  );
}
