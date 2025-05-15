import { useState } from "react";
import { useWallet } from "./useWallet";
import { TransactionItem } from "@/lib/types";

export function useTransactions() {
  const { transactions } = useWallet();
  const [filter, setFilter] = useState({
    platform: 'all',
    type: 'all',
    search: ''
  });

  const filteredTransactions = transactions.filter(tx => {
    // Filter by platform
    if (filter.platform !== 'all' && tx.platform !== filter.platform) {
      return false;
    }
    
    // Filter by type
    if (filter.type !== 'all' && tx.type !== filter.type) {
      return false;
    }
    
    // Filter by search term
    if (filter.search && !tx.username.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return {
    transactions: filteredTransactions,
    filter,
    setFilter
  };
}
