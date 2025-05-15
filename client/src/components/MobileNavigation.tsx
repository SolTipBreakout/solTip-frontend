import { Link, useLocation } from "wouter";

export default function MobileNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 border-t border-gray-800 z-10">
      <div className="flex justify-around py-2">
        <Link href="/">
          <div className={`flex flex-col items-center p-2 cursor-pointer ${isActive("/") ? "text-[#14F195]" : "text-gray-400"}`}>
            <i className="fas fa-th-large mb-1"></i>
            <span className="text-xs">Dashboard</span>
          </div>
        </Link>
        <Link href="/send">
          <div className={`flex flex-col items-center p-2 cursor-pointer ${isActive("/send") ? "text-[#14F195]" : "text-gray-400"}`}>
            <i className="fas fa-paper-plane mb-1"></i>
            <span className="text-xs">Send</span>
          </div>
        </Link>
        <Link href="/wallet">
          <div className={`flex flex-col items-center p-2 cursor-pointer ${isActive("/wallet") ? "text-[#14F195]" : "text-gray-400"}`}>
            <i className="fas fa-wallet mb-1"></i>
            <span className="text-xs">Wallet</span>
          </div>
        </Link>
        <Link href="/transactions">
          <div className={`flex flex-col items-center p-2 cursor-pointer ${isActive("/transactions") ? "text-[#14F195]" : "text-gray-400"}`}>
            <i className="fas fa-exchange-alt mb-1"></i>
            <span className="text-xs">History</span>
          </div>
        </Link>
        <Link href="/connect">
          <div className={`flex flex-col items-center p-2 cursor-pointer ${isActive("/connect") ? "text-[#14F195]" : "text-gray-400"}`}>
            <i className="fas fa-link mb-1"></i>
            <span className="text-xs">Connect</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
