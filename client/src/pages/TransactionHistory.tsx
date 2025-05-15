import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress, formatDateTime, getPlatformIcon } from "@/lib/formatters";
import ConnectWalletModal from "@/components/ConnectWalletModal";

export default function TransactionHistory() {
  const { isConnected } = useWallet();
  const { transactions, filter, setFilter } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value });
    setCurrentPage(1);
  };

  const handlePlatformFilter = (value: string) => {
    setFilter({ ...filter, platform: value });
    setCurrentPage(1);
  };

  const handleTypeFilter = (value: string) => {
    setFilter({ ...filter, type: value });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-gray-500 dark:text-gray-400">View and filter your transaction history</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <i className="fas fa-exchange-alt text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to see your transaction history</p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="px-6 py-2 text-sm gradient-button text-white rounded-full"
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
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-gray-500 dark:text-gray-400">View and filter your transaction history</p>
      </div>
      
      {/* Filters & Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
        <div className="md:flex items-center justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative w-full md:w-auto md:flex-1 md:max-w-md">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <Input 
              type="text" 
              placeholder="Search by username or address" 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              value={filter.search}
              onChange={handleSearch}
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2 md:space-x-4">
            <Select onValueChange={handlePlatformFilter} value={filter.platform}>
              <SelectTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={handleTypeFilter} value={filter.type}>
              <SelectTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>
            
            <button className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
              <i className="fas fa-filter"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Platform</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-4">
                    <div className={`p-2 rounded-full ${transaction.type === 'received' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'} inline-flex items-center justify-center w-8 h-8`}>
                      <i className={`fas fa-arrow-${transaction.type === 'received' ? 'down' : 'up'}`}></i>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">{transaction.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{transaction.address}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-1">
                      <i className={getPlatformIcon(transaction.platform)}></i>
                      <span className="capitalize">{transaction.platform}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-4 font-bold ${transaction.type === 'received' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {transaction.type === 'received' ? '+' : '-'}{transaction.amount} SOL
                  </td>
                  <td className="px-4 py-4 text-sm">{formatDateTime(transaction.date)}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 capitalize">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, transactions.length)}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, transactions.length)}</span> of <span className="font-medium">{transactions.length}</span> results
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-600'}`}
            >
              Previous
            </button>
            
            {[...Array(Math.min(totalPages, 3))].map((_, index) => {
              const pageNumber = currentPage <= 2 ? index + 1 : currentPage - 1 + index;
              if (pageNumber <= totalPages) {
                return (
                  <button 
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)} 
                    className={`px-3 py-1 rounded ${pageNumber === currentPage ? 'bg-[#9945FF] text-white' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm'}`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              return null;
            })}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-600'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
