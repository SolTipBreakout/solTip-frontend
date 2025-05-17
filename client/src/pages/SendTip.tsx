import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Twitter, MessageCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, Connection, PublicKey, Transaction as SolanaTransaction, SystemProgram } from "@solana/web3.js";
import { api, PlatformType } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const TelegramIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

interface PlatformOption {
  value: PlatformType;
  label: string;
  icon: React.ElementType;
  color: string;
}

const platformOptions: PlatformOption[] = [
  { value: "twitter", label: "Twitter", icon: Twitter, color: "#1DA1F2" },
  { value: "discord", label: "Discord", icon: MessageCircle, color: "#5865F2" },
  { value: "telegram", label: "Telegram", icon: TelegramIcon, color: "#0088cc" },
] as const;

const SOLANA_RPC_URL = "https://api.devnet.solana.com";

export default function SendTip() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<PlatformType>("twitter");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendTip = async () => {
    if (!amount || !username || !connected || !publicKey || !sendTransaction) {
      toast({
        title: "Error",
        description: "Please fill all fields and connect your wallet",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      toast({
        title: "Looking up recipient...",
        description: `Finding wallet for @${username} on ${platform}`,
      });
      
      const recipientWallet = await api.user.getWalletBySocial(platform, username);
      if (!recipientWallet?.publicKey) {
        throw new Error("Could not find recipient wallet");
      }
      
      const connection = new Connection(SOLANA_RPC_URL, "confirmed");
      const amountLamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      
      const transaction = new SolanaTransaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientWallet.publicKey),
          lamports: amountLamports,
        })
      );
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      toast({
        title: "Sending transaction...",
        description: `Sending ${amount} SOL to @${username}`,
      });
      
      const signature = await sendTransaction(transaction, connection);
      
      await api.transaction.record({
        signature,
        senderWalletId: publicKey.toString(),
        recipientAddress: recipientWallet.publicKey,
        amount: parseFloat(amount),
        tokenSymbol: "SOL",
        status: "pending",
      });
      
      toast({
        title: "Transaction sent!",
        description: "Waiting for confirmation...",
      });
      
      await connection.confirmTransaction(signature, "confirmed");
      
      await api.transaction.updateStatus(signature, {
        status: "confirmed"
      });
      
      toast({
        title: "Success!",
        description: `Successfully sent ${amount} SOL to @${username} on ${platform}`,
      });
      
      setUsername("");
      setAmount("");
    } catch (error) {
      console.error("Failed to send tip:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send tip",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container max-w-2xl mx-auto px-4 py-8"
    >
      <Card className="border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10">
        <CardHeader>
          <CardTitle className="text-white">Send SOL to anyone</CardTitle>
          <CardDescription className="text-white/60">
            Send a tip using a platform username instead of a wallet address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Platform</label>
              <div className="flex gap-2">
                {platformOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = platform === opt.value;
                  
                  return (
                    <Button
                      key={opt.value}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className={`flex-1 gap-2 ${
                        isSelected 
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white"
                      }`}
                      onClick={() => setPlatform(opt.value)}
                    >
                      <Icon 
                        className="w-4 h-4" 
                        style={{ color: isSelected ? "currentColor" : opt.color }}
                      />
                      {opt.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-white/80">
                Username
              </label>
              <div className="flex">
                <div className="flex items-center bg-black/30 border border-r-0 border-purple-900/30 rounded-l-md px-3">
                  <span className="text-white/60">@</span>
                </div>
                <Input
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-none rounded-r-md bg-black/30 border-purple-900/30 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-white/80">
                Amount (SOL)
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className="bg-black/30 border-purple-900/30 text-white placeholder:text-white/40"
              />
              {amount && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-white/60"
                >
                  ≈ {(parseFloat(amount) * LAMPORTS_PER_SOL).toLocaleString()} lamports
                </motion.p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {connected ? (
            <Button
              onClick={handleSendTip}
              disabled={!amount || !username || loading}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white ${loading ? 'opacity-70' : ''}`}
              size="lg"
            >
              {loading ? "Sending..." : "Send Tip"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          ) : (
            <div className="w-full text-center">
              <p className="text-white/60 mb-4">Connect your wallet using the button in the header to send tips</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
