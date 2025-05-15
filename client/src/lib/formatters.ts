// Format wallet address to shortened form
export function formatAddress(address: string, length: number = 6): string {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  
  return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
}

// Format date to readable string
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('en-US', options);
}

// Format time to readable string
export function formatTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  };
  
  return date.toLocaleTimeString('en-US', options);
}

// Format datetime to readable string
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} • ${formatTime(date)}`;
}

// Format currency amount
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(amount);
}

// Format SOL amount
export function formatSOL(amount: number): string {
  return amount.toFixed(2) + ' SOL';
}

// Get platform icon class
export function getPlatformIcon(platform: string): string {
  switch (platform.toLowerCase()) {
    case 'twitter':
      return 'fab fa-twitter text-blue-400';
    case 'discord':
      return 'fab fa-discord text-indigo-500';
    case 'telegram':
      return 'fab fa-telegram text-blue-500';
    default:
      return 'fas fa-globe';
  }
}

// Get transaction type icon class
export function getTransactionTypeIcon(type: 'sent' | 'received'): string {
  return type === 'sent' 
    ? 'fas fa-arrow-up text-red-600 dark:text-red-300' 
    : 'fas fa-arrow-down text-green-600 dark:text-green-300';
}

// Get transaction type background class
export function getTransactionTypeBgClass(type: 'sent' | 'received'): string {
  return type === 'sent' 
    ? 'bg-red-100 dark:bg-red-900' 
    : 'bg-green-100 dark:bg-green-900';
}
