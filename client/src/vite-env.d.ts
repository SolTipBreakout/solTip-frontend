/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEXT_PUBLIC_API_URL: string
  readonly VITE_NEXT_PUBLIC_SOLANA_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 