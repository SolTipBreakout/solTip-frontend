import { Link, useLocation } from "wouter";

export default function MobileNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-10">
      <div className="flex justify-around py-2">
        <Link href="/">
          <a className={`flex flex-col items-center p-2 ${isActive("/") ? "text-[#9945FF]" : "text-gray-500 dark:text-gray-400"}`}>
            <i className="fas fa-th-large mb-1"></i>
            <span className="text-xs">Dashboard</span>
          </a>
        </Link>
        <Link href="/send">
          <a className={`flex flex-col items-center p-2 ${isActive("/send") ? "text-[#9945FF]" : "text-gray-500 dark:text-gray-400"}`}>
            <i className="fas fa-paper-plane mb-1"></i>
            <span className="text-xs">Send</span>
          </a>
        </Link>
        <Link href="/wallet">
          <a className={`flex flex-col items-center p-2 ${isActive("/wallet") ? "text-[#9945FF]" : "text-gray-500 dark:text-gray-400"}`}>
            <i className="fas fa-wallet mb-1"></i>
            <span className="text-xs">Wallet</span>
          </a>
        </Link>
        <Link href="/transactions">
          <a className={`flex flex-col items-center p-2 ${isActive("/transactions") ? "text-[#9945FF]" : "text-gray-500 dark:text-gray-400"}`}>
            <i className="fas fa-exchange-alt mb-1"></i>
            <span className="text-xs">History</span>
          </a>
        </Link>
        <Link href="/connect">
          <a className={`flex flex-col items-center p-2 ${isActive("/connect") ? "text-[#9945FF]" : "text-gray-500 dark:text-gray-400"}`}>
            <i className="fas fa-link mb-1"></i>
            <span className="text-xs">Connect</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
