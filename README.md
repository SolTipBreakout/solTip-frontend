# SolTipConnect: Frontend for SolTip Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-blue)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.14-blue)](https://vitejs.dev/)

SolTipConnect is the modern, responsive web frontend for SolTip, a cross-platform Solana tipping system. It provides an intuitive interface for users to manage wallets, connect social accounts, and send tips across Twitter, Discord, and Telegram.

## 🎯 Features

- **User Authentication**: Secure login via Privy
- **Wallet Management**: Create, import, and view wallet details
- **Platform Connections**: Link and manage Twitter, Discord, and Telegram accounts
- **Tipping Interface**: Simple, user-friendly tipping to other users via social handles
- **Transaction History**: View and filter transaction history
- **Real-time Balance Updates**: See wallet balance and token holdings in real-time
- **Responsive Design**: Optimized for both mobile and desktop

## 🏛️ Architecture

SolTipConnect is built with a modern React stack:

```
┌─────────────────────────────────────┐
│           SolTipConnect             │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────┐    ┌────────────┐  │
│  │ React Router│    │React Query │  │
│  └─────────────┘    └────────────┘  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │          Components         │    │
│  ├─────────────────────────────┤    │
│  │  - WalletContext            │    │
│  │  - Platform Connectors      │    │
│  │  - Transaction Forms        │    │
│  │  - UI Components            │    │
│  └─────────────────────────────┘    │
│                  │                  │
│                  ▼                  │
│  ┌─────────────────────────────┐    │
│  │       API Integration       │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

## 🛠️ Project Structure

```
SolTipConnect/
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (e.g., WalletContext)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries and API clients
│   │   ├── pages/            # Page components
│   │   ├── styles/           # CSS and styling
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   └── ...
├── server/                   # Express server for serving the frontend
├── shared/                   # Shared types and utilities
├── package.json
└── vite.config.ts
```

## 💻 Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API and React Query
- **Authentication**: Privy
- **Wallet Integration**: Solana Web3.js and wallet adapter
- **Routing**: React Router
- **UI Components**: Custom components with Radix UI primitives
- **API Communication**: Axios with React Query

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- pnpm
- MCP Endpoint server running (for API integration)

### Installation

1. Clone the repository
```bash
git clone https://github.com/SolTipBreakout/solBreakOut.git
cd solBreakOut/SolTipConnect
```

2. Install dependencies
```bash
pnpm install
```

3. Create a `.env` file in the root directory
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_KEY=your-api-key

# Privy Authentication
VITE_PRIVY_APP_ID=your-privy-app-id
```

4. Start the development server
```bash
pnpm dev
```

5. Build for production
```bash
pnpm build
```

6. Run the production build
```bash
pnpm start
```

## 📱 Key User Flows

### Authentication
1. User visits the site
2. User clicks "Connect Wallet" or "Sign In"
3. Privy authentication flow is triggered
4. User completes authentication and is redirected to dashboard

### Linking Social Accounts
1. User navigates to "Platforms" section
2. User selects a platform to connect (Twitter, Discord, Telegram)
3. User authenticates with the selected platform
4. Platform account is linked to the user's wallet

### Sending a Tip
1. User navigates to "Send Tip" section
2. User enters recipient's social handle
3. User selects amount and platform
4. User confirms transaction
5. Transaction is processed and confirmed

### Viewing Transaction History
1. User navigates to "History" section
2. User sees a list of past transactions
3. User can filter and search transactions
4. User can click on a transaction to view details

## 🔧 Configuration

The application can be configured using environment variables:

| Variable           | Description                                   | Default                       |
|--------------------|-----------------------------------------------|-------------------------------|
| VITE_API_BASE_URL  | Base URL for backend API                      | http://localhost:3000/api     |
| VITE_API_KEY       | API key for authentication                    | (Required)                    |
| VITE_PRIVY_APP_ID  | Privy application ID                          | (Required)                    |
| VITE_RPC_URL       | Solana RPC endpoint (fallback)                | https://api.devnet.solana.com |

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## 🤝 Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](../CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 