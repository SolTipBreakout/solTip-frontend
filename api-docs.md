
# SolTip API Documentation

This document provides details for all available API endpoints to use in your SolTip frontend application.

## Base URL

All API endpoints are prefixed with `/api`

## Authentication

Most endpoints require authentication via an API key which must be included in the request headers.

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### User and Wallet Endpoints

#### 1. Get User Profile

```
GET /api/user/profile
```

**Description:** Retrieves the authenticated user's profile information.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user_email",
    "createdAt": "timestamp"
  }
}
```

#### 2. Get Wallet by Social Account

```
GET /api/user/wallet/social?platform={platform}&platformId={platformId}
```

**Description:** Retrieves wallet information for a specific social platform account.

**Authentication:** Required

**Query Parameters:**
- `platform` (required): The social platform (twitter, discord, telegram)
- `platformId` (required): The unique ID of the user on that platform

**Response:**
```json
{
  "success": true,
  "data": {
    // Wallet information
  }
}
```

#### 3. Get or Create Wallet

```
POST /api/user/wallet/get-or-create
```

**Description:** Gets an existing wallet for a social account or creates a new one if it doesn't exist.

**Authentication:** Required

**Request Body:**
```json
{
  "platform": "twitter",
  "platformId": "twitter_user_id",
  "label": "My Twitter Wallet"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Wallet information
  }
}
```

#### 4. Link Wallet to Social Account

```
POST /api/user/wallet/link
```

**Description:** Links an existing wallet to a social platform account.

**Authentication:** Required

**Request Body:**
```json
{
  "platform": "discord",
  "platformId": "discord_user_id",
  "walletPublicKey": "solana_public_key"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Wallet information
  }
}
```

#### 5. Get User Wallets

```
GET /api/user/wallets
```

**Description:** Retrieves all wallets for the authenticated user.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": [
    // Array of wallet objects
  ]
}
```

#### 6. Create New Wallet

```
POST /api/user/wallets
```

**Description:** Creates a new wallet for the user.

**Authentication:** Required

**Request Body:**
```json
{
  "platform": "telegram",
  "platformId": "telegram_user_id",
  "label": "My Telegram Wallet"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // New wallet information
  }
}
```

#### 7. Get User Transactions

```
GET /api/user/transactions/{walletAddress}?limit={limit}&offset={offset}
```

**Description:** Retrieves transaction history for a specific wallet.

**Authentication:** Required

**URL Parameters:**
- `walletAddress` (required): The Solana wallet address

**Query Parameters:**
- `limit` (optional): Number of transactions to return (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      // Array of transaction objects
    ],
    "count": 42,
    "limit": 10,
    "offset": 0
  }
}
```

#### 8. Get Transaction Details

```
GET /api/user/transaction/{signature}
```

**Description:** Retrieves details for a specific transaction.

**Authentication:** Required

**URL Parameters:**
- `signature` (required): The transaction signature/ID

**Response:**
```json
{
  "success": true,
  "data": {
    // Transaction details
  }
}
```

#### 9. Get User Profile with Social Accounts

```
GET /api/user/profile/social?platform={platform}&platformId={platformId}
```

**Description:** Retrieves complete user profile with wallet, social accounts, and transaction history.

**Authentication:** Required

**Query Parameters:**
- `platform` (required): The social platform (twitter, discord, telegram)
- `platformId` (required): The unique ID of the user on that platform

**Response:**
```json
{
  "success": true,
  "data": {
    // Complete user profile information
  }
}
```

#### 10. Get Social Accounts for Wallet

```
GET /api/user/social-accounts/{walletAddress}
```

**Description:** Retrieves all social accounts linked to a specific wallet.

**Authentication:** Required

**URL Parameters:**
- `walletAddress` (required): The Solana wallet address

**Response:**
```json
{
  "success": true,
  "data": [
    // Array of social account objects
  ]
}
```

### Transaction Endpoints

#### 11. Get Transaction by Signature

```
GET /api/transaction/{signature}
```

**Description:** Retrieves a specific transaction by its signature.

**Authentication:** Required (API Key)

**URL Parameters:**
- `signature` (required): The transaction signature

**Response:**
```json
{
  "success": true,
  "data": {
    // Transaction details
  }
}
```

#### 12. Record New Transaction

```
POST /api/transaction
```

**Description:** Records a new transaction in the system.

**Authentication:** Required (API Key)

**Request Body:**
```json
{
  "signature": "transaction_signature",
  "senderWalletId": "sender_wallet_id",
  "recipientAddress": "recipient_solana_address",
  "amount": 1.5,
  "tokenMint": "token_mint_address",  // Optional
  "tokenSymbol": "SOL",               // Optional
  "status": "pending"                 // Optional (default: "pending")
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Transaction details
  }
}
```

#### 13. Update Transaction Status

```
PATCH /api/transaction/{signature}/status
```

**Description:** Updates the status of an existing transaction.

**Authentication:** Required (API Key)

**URL Parameters:**
- `signature` (required): The transaction signature

**Request Body:**
```json
{
  "status": "confirmed",  // "pending", "confirmed", or "failed"
  "blockTime": 1234567890,  // Optional
  "fee": 0.000005  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction status updated to confirmed"
}
```

#### 14. Get Wallet Transactions

```
GET /api/transaction/wallet/{publicKey}?limit={limit}&offset={offset}
```

**Description:** Retrieves transactions for a specific wallet.

**Authentication:** Required (API Key)

**URL Parameters:**
- `publicKey` (required): The wallet's public key

**Query Parameters:**
- `limit` (optional): Number of transactions to return (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      // Array of transaction objects
    ],
    "count": 42,
    "limit": 10,
    "offset": 0
  }
}
```

## Error Responses

All endpoints return a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Error message description"
  }
}
```

Common error codes:
- 400: Bad Request (missing or invalid parameters)
- 401: Unauthorized (missing or invalid API key)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error (server-side issue)



