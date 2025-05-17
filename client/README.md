# SolTipConnect Frontend

A modern web application for sending SOL tips via social media handles. Built with Next.js 14, Tailwind CSS, shadcn/ui, and Framer Motion.

## Overview

SolTipConnect allows users to send SOL tokens to anyone using their social media handles instead of wallet addresses. This makes sending cryptocurrency more accessible and user-friendly.

## Features

- **Connect Wallet**: Connect your Solana wallet to the app using the Solana Wallet Adapter
- **Send Tips**: Send SOL to users via their social media handles using direct wallet-to-wallet transfers
- **Recipient Lookup**: Look up a recipient's wallet address using their social platform username
- **Transaction History**: View your transaction history
- **Platform Connections**: Connect your social media accounts to receive tips
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Sleek interface with animations and transitions

## Getting Started

### Prerequisites

- Node.js 16 or higher
- pnpm (preferred) or npm/yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables:

Create a `.env.local` file with the following variables:

```
VITE_NEXT_PUBLIC_API_URL=http://localhost:3001
VITE_NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

> Note: Vite requires environment variables to be prefixed with `VITE_` to be accessible in the browser.

4. Start the development server:

```bash
pnpm dev
```

## User Experience

The application focuses on providing a seamless user experience:

- **Simple Onboarding**: Connect your wallet and start sending tips
- **Platform Registration**: Users must register their wallet address using one of the platform bots (Twitter, Telegram, Discord)
- **Direct Transfers**: Send SOL directly from your wallet to the recipient's wallet using their social handle
- **Clear Guidance**: The app provides clear instructions for users who need to register their wallets
- **Helpful Feedback**: Toast notifications and loading states keep users informed

## Direct Wallet-to-Wallet Transfers

SolTipConnect now features direct wallet-to-wallet transfers:

1. Enter the recipient's username on their preferred platform
2. Click the lookup button to find the recipient's wallet address
3. Enter the amount of SOL to send
4. Click "Send Tip" to initiate a direct Solana transfer
5. Confirm the transaction with your wallet
6. Transaction status is displayed in real-time

This approach offers:
- Lower fees compared to intermediary services
- Faster transaction processing
- Complete transparency on the blockchain
- Full control over your funds

## Registration Process

To use SolTipConnect, users must register their wallet address with one of the platform bots:

1. **Twitter Bot**: @ajweb3devjimoh
2. **Telegram Bot**: @solTipping_bot
3. **Discord Bot**: Bot ID: 1371577577734672484

The registration process is as follows:
1. Contact the bot on your preferred platform
2. Send the command: `/register YourWalletAddress` 
3. Follow the bot's instructions to complete registration
4. Once registered, return to the SolTipConnect web app

The app will detect if a user's wallet is not registered and provide clear instructions on how to complete the registration process.

## Project Structure

The project follows a standard Next.js 14 structure:

- `src/app`: Next.js app router components and routes
- `src/components`: Reusable UI components
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and API client
- `src/pages`: Main page components
- `src/providers`: Context providers for app-wide state
- `public`: Static assets

## Key Components

- **Dashboard**: Shows wallet balance and transaction history
- **SendTip**: Interface for sending SOL to social media handles
- **ConnectPlatforms**: Connect and manage your social media accounts
- **Header**: Navigation and wallet connection

## Development Notes

- The app uses API routes to communicate with the backend
- The UI components are built using shadcn/ui
- Animations are implemented with Framer Motion
- Styling is done with Tailwind CSS
- Direct wallet-to-wallet transfers use the Solana Web3.js library

## API Integration

The app connects to a backend API for:

- User profile management
- Platform connections
- Transaction processing
- Balance information
- Social-to-wallet address resolution

API requests are managed through the `api.ts` client with typed endpoints.

## License

This project is licensed under the MIT License. 