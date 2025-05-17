I'll create a focused API documentation that matches your actual frontend API client code and includes just the relevant endpoints, particularly the SOL sending functionality. I'll clean it up based on what's actually implemented in your codebase.

```markdown
# Social Wallet API Documentation

## Base URL
`http://u4008kw840kcsgsc4kwgo448.34.67.137.207.sslip.io/api`

## Authentication
All endpoints require `x-api-key` header with your API key
Default development key: `dev-key-1`

## Type Definitions
```typescript
type PlatformType = "twitter" | "discord" | "telegram";
type TransactionStatus = "pending" | "confirmed" | "failed";
type TransactionType = "tip" | "withdrawal" | "deposit";

interface Platform {
  type: PlatformType;
  username: string;
  connected: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Wallet {
  publicKey: string;
  isCustodial: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  signature: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  tokenSymbol: string;
  senderWalletId: string;
  recipientAddress: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  wallet: Wallet;
  platforms: Platform[];
  transactions: Transaction[];
}
```

## Endpoints

### User Profile & Wallet Management

#### Get User Profile
```typescript
GET /user/{walletAddress}

Query Parameters:
- limit?: number (default: 10)
- offset?: number (default: 0)

Response: UserProfile
```

#### Get Wallet by Social Account
```typescript
GET /user/wallet/{platform}/{username}

Parameters:
- platform: PlatformType
- username: string

Response: Wallet
```

#### Create or Get Wallet
```typescript
POST /user/wallet

Request Body:
{
  publicKey: string
}

Response: Wallet
```

#### Link Wallet to Social Account
```typescript
POST /user/wallet/link

Request Body:
{
  platform: PlatformType;
  platformId: string;
  walletPublicKey: string;
}

Response: Wallet
```

#### Unlink Wallet from Platform
```typescript
DELETE /user/wallet/unlink

Query Parameters:
- platform: PlatformType

Response: { success: boolean }
```

#### Get Social Accounts
```typescript
GET /user/social-accounts/{walletAddress}

Response: Platform[]
```

### Platform Connections

#### Connect Platform
```typescript
POST /platform/connect

Request Body:
{
  platform: PlatformType;
  username: string;
}

Response: Platform
```

#### Disconnect Platform
```typescript
POST /platform/disconnect/{platform}

Parameters:
- platform: PlatformType

Response: Platform
```

### Transactions

#### Send SOL to User
```typescript
POST /mcp/tools/sendSolToUser

Request Body:
{
  senderPlatform: PlatformType;
  senderPlatformId: string;
  recipientPlatform: PlatformType;
  recipientPlatformId: string;
  amount: number;
}

Response: {
  content: [{
    type: "text",
    text: string // Contains transaction signature and status
  }]
}
```

#### Record Transaction
```typescript
POST /transaction

Request Body:
{
  signature: string;
  senderWalletId: string;
  recipientAddress: string;
  amount: number;
  tokenSymbol: string;
  status: TransactionStatus;
}

Response: Transaction
```

#### Update Transaction Status
```typescript
PATCH /transaction/{signature}/status

Request Body:
{
  status: TransactionStatus;
}

Response: Transaction
```

## Example Usage

### Sending SOL to a User
```typescript
// Helper function to send tip to a user
async function sendTipToUser(
  platform: PlatformType,
  username: string,
  amount: number,
  senderPublicKey: string
): Promise<{ recipientPublicKey: string }> {
  const recipientWallet = await api.user.getWalletBySocial(platform, username);
  
  if (!recipientWallet) {
    throw new Error(`No wallet found for @${username} on ${platform}`);
  }
  
  if (!recipientWallet.publicKey) {
    throw new Error(`Recipient wallet doesn't have a valid public key`);
  }
  
  return {
    recipientPublicKey: recipientWallet.publicKey,
  };
}

// Example API call
const response = await fetch(`${API_BASE_URL}/mcp/tools/sendSolToUser`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  },
  body: JSON.stringify({
    senderPlatform: 'twitter',
    senderPlatformId: 'sender123',
    recipientPlatform: 'twitter',
    recipientPlatformId: 'recipient456',
    amount: 1.0 // SOL amount
  })
});
```

## Error Handling
All endpoints return standard error responses:
```typescript
{
  error: string;
  message: string;
  status?: number;
}
```


You're right! Let me add the documentation for the GET /user/profile/:walletAddress endpoint based on the implementation shown. I'll update the User Profile section of the documentation:

```markdown
### User Profile & Wallet Management

#### Get User Profile by Wallet Address
```typescript
GET /user/profile/:walletAddress

Parameters:
- walletAddress: string (required) - Solana wallet public key

Response: {
  success: boolean;
  data: {
    wallets: Array<{
      id: string;
      public_key: string;
      is_custodial: boolean;
      label?: string;
      created_at: string;
      updated_at: string;
    }>;
    socialAccounts: Array<{
      platform: 'twitter' | 'telegram' | 'discord';
      platform_id: string;
      wallet_id: string;
      created_at: string;
    }>;
    transactions: Array<Transaction>; // Last 5 transactions
  }
}

Errors:
- 400: Wallet address is required
- 404: User profile not found
```

Example Usage:
```typescript
const response = await fetch(`${API_BASE_URL}/user/profile/7xKXtg2CW1cRCpxRQzXJdx5YdHa3Vy8bLqGH24NEph`, {
  headers: {
    'x-api-key': API_KEY
  }
});

if (!response.ok) {
  throw new Error('Failed to fetch profile');
}

const { success, data } = await response.json();
```

This endpoint returns:
- All wallets associated with the address
- All linked social accounts across platforms
- Most recent 5 transactions
- Timestamps in ISO 8601 format
```

Common HTTP Status Codes:
- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Invalid/missing API key
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server-side error

## Notes
- All timestamps are in ISO 8601 format
- SOL amounts are in whole SOL (not lamports)
- Transaction signatures can be viewed on Solana Explorer
- New wallets are automatically created for recipients if they don't exist
```

This documentation focuses on the endpoints that are actually implemented in your codebase and includes the specific types you're using in your frontend API client. I've removed any irrelevant MCP documentation and focused on the core social wallet functionality, particularly the SOL sending feature.
