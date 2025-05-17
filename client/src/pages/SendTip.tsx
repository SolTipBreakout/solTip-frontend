import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Twitter, MessageCircle, UserPlus, ExternalLink, RefreshCw, Search, Check, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { api, PlatformType } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

interface RecipientWallet {
  publicKey: string;
  platform: PlatformType;
  platformId: string;
}

const platformOptions: PlatformOption[] = [
  { value: "twitter", label: "Twitter", icon: Twitter, color: "#1DA1F2" },
  { value: "discord", label: "Discord", icon: MessageCircle, color: "#5865F2" },
  { value: "telegram", label: "Telegram", icon: TelegramIcon, color: "#0088cc" },
] as const;

// RPC Connection for Solana
const connection = new Connection(
  import.meta.env.VITE_NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  "confirmed"
);

export default function SendTip() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<PlatformType>("twitter");
  const [loading, setLoading] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [recipientWallet, setRecipientWallet] = useState<RecipientWallet | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const { toast } = useToast();

  // Function to look up recipient's wallet address
  const lookupRecipientWallet = async () => {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }
    
    setLookupLoading(true);
    setRecipientWallet(null);
    
    try {
      const response = await api.user.getWalletBySocial(platform, username);
      
      console.log("Wallet lookup response:", response);
      
      if (response.success && response.data && response.data.socialAccounts && response.data.socialAccounts.length > 0) {
        setRecipientWallet({
          publicKey: response.data.publicKey,
          platform,
          platformId: username
        });
        
        toast({
          title: "Wallet Found",
          description: `Found wallet for @${username}`,
        });
      } else {
        throw new Error("Wallet not found");
      }
    } catch (error) {
      console.error("Failed to lookup wallet:", error);
      
      // Check if the error message indicates the user profile doesn't exist
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (
        errorMessage.includes("Wallet not found") || 
        errorMessage.includes("404") || 
        errorMessage.includes("not found")
      ) {
        toast({
          title: "Wallet Not Found",
          description: `No wallet found for @${username} on ${platform}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to lookup wallet",
          variant: "destructive",
        });
      }
    } finally {
      setLookupLoading(false);
    }
  };

  // Function to handle sending SOL directly via wallet adapter
  const handleSendTip = async () => {
    if (!amount || !recipientWallet || !connected || !publicKey || !sendTransaction) {
      toast({
        title: "Error",
        description: "Please fill all fields, connect your wallet, and lookup the recipient",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      setTransactionStatus("pending");
      
      const parsedAmount = parseFloat(amount) * LAMPORTS_PER_SOL;
      
      // Create a Solana transaction to send SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientWallet.publicKey),
          lamports: parsedAmount,
        })
      );
      
      // Sign and send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      toast({
        title: "Transaction Sent",
        description: `Your transaction has been sent and is being processed`,
      });
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      
      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }
      
      setTransactionStatus("success");
      toast({
        title: "Success!",
        description: `Successfully sent ${amount} SOL to @${username} on ${platform}`,
      });
      
      // Reset form
      setUsername("");
      setAmount("");
      setRecipientWallet(null);
      setTransactionStatus("idle");
      
    } catch (error) {
      console.error("Failed to send tip:", error);
      setTransactionStatus("error");
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send tip",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setNeedsRegistration(false);
  };

  if (connected && publicKey && needsRegistration) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container max-w-2xl mx-auto px-4 py-8"
      >
        <Card className="border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10">
          <CardHeader>
            <CardTitle className="text-white">Wallet Not Registered</CardTitle>
            <CardDescription className="text-white/60">
              You need to register your wallet before sending tips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-black/30 border border-purple-900/30 rounded-md p-4">
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <UserPlus className="mr-2 h-4 w-4 text-[#14F195]" />
                  Register your wallet first
                </h3>
                <p className="text-white/60 mb-4">
                  Your wallet address isn't registered with our service. Please register via one of our bots:
                </p>

                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-2 bg-black/40 p-3 rounded border border-purple-900/30">
                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                    <div>
                      <p className="text-white font-medium">Twitter</p>
                      <p className="text-white/60 text-sm">@ajweb3devjimoh</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-auto border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white"
                      asChild
                    >
                      <a href="https://twitter.com/ajweb3devjimoh" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" /> Open
                      </a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-black/40 p-3 rounded border border-purple-900/30">
                    <TelegramIcon className="h-5 w-5 text-[#0088cc]" />
                    <div>
                      <p className="text-white font-medium">Telegram</p>
                      <p className="text-white/60 text-sm">@solTipping_bot</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-auto border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white"
                      asChild
                    >
                      <a href="https://t.me/solTipping_bot" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" /> Open
                      </a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-black/40 p-3 rounded border border-purple-900/30">
                    <MessageCircle className="h-5 w-5 text-[#5865F2]" />
                    <div>
                      <p className="text-white font-medium">Discord</p>
                      <p className="text-white/60 text-sm">Bot ID: 1371577577734672484</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/60 mb-2">
                  Registration instructions:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-white/60 mb-4">
                  <li>Contact one of the bots listed above</li>
                  <li>Send the command: <span className="bg-black/40 px-2 py-1 rounded font-mono text-xs">/register {publicKey.toString()}</span></li>
                  <li>Follow the bot's instructions to complete registration</li>
                  <li>Once registered, you can return here to send tips</li>
                </ol>
                
                <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded">
                  <p className="text-yellow-300 text-sm">
                    Note: Registration cannot be done directly from this website. You must use one of the bots to register your wallet.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={handleTryAgain} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

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
                      onClick={() => {
                        setPlatform(opt.value);
                        setRecipientWallet(null);
                      }}
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
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setRecipientWallet(null);
                  }}
                  className="rounded-none rounded-r-md bg-black/30 border-purple-900/30 text-white placeholder:text-white/40"
                />
                <Button
                  onClick={lookupRecipientWallet}
                  disabled={!username || lookupLoading}
                  className="ml-2 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {lookupLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Search className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {recipientWallet && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-xs text-[#14F195] font-medium mt-1"
                >
                  <Check className="h-4 w-4" />
                  <span>Wallet found for @{username}</span>
                </motion.div>
              )}
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

          {transactionStatus === "pending" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <Alert className="bg-blue-900/20 border-blue-500/30">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <RefreshCw className="h-4 w-4 text-blue-400" />
                </motion.div>
                <AlertTitle className="text-blue-400">Transaction in Progress</AlertTitle>
                <AlertDescription className="text-blue-300/80">
                  Your transaction is being processed. Please wait...
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {transactionStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <Alert className="bg-green-900/20 border-green-500/30">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                <AlertTitle className="text-green-400">Transaction Successful</AlertTitle>
                <AlertDescription className="text-green-300/80">
                  Your tip has been sent successfully!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {transactionStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <Alert className="bg-red-900/20 border-red-500/30">
                <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                <AlertTitle className="text-red-400">Transaction Failed</AlertTitle>
                <AlertDescription className="text-red-300/80">
                  There was an error sending your tip. Please try again.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>
        <CardFooter>
          {connected ? (
            <Button
              onClick={handleSendTip}
              disabled={!amount || !recipientWallet || loading || lookupLoading}
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
