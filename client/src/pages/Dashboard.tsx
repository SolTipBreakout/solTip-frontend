import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Twitter, MessageCircle, UserPlus, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { WalletCard } from "@/components/WalletCard";
import { api, PlatformType, Transaction, UserProfileResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

interface PlatformData {
  type: PlatformType;
  platformId: string;
  username: string;
  connected: boolean;
  createdAt: string;
}

interface UserData {
  wallet: {
    id: string;
    publicKey: string;
    isCustodial: boolean;
    balance: number;
    createdAt: string;
    updatedAt: string;
  };
  platforms: PlatformData[];
  transactions: Transaction[];
}

const platformOptions: PlatformOption[] = [
  { value: "twitter", label: "Twitter", icon: Twitter, color: "#1DA1F2" },
  { value: "discord", label: "Discord", icon: MessageCircle, color: "#5865F2" },
  { value: "telegram", label: "Telegram", icon: TelegramIcon, color: "#0088cc" },
] as const;

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const { toast } = useToast();
  const [walletBalance, setWalletBalance] = useState(0);

  const fetchWalletBalance = async () => {
    if (!publicKey || !connection) return 0;
    
    try {
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      setWalletBalance(solBalance);
      return solBalance;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      return 0;
    }
  };

  const fetchUserProfile = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    setShowAccountInfo(false);
    
    try {
      const solanaBalance = await fetchWalletBalance();
      
      const response = await api.user.getProfileByWalletAddress(publicKey.toString());
      
      if (response.success && response.data) {
        const mainWallet = response.data?.wallets[0] || null;
        if (!mainWallet) {
          throw new Error("No wallets found for this user");
        }
        
        const platforms: PlatformData[] = response.data.socialAccounts.map((account: { platform: any; platform_id: any; created_at: any; }) => {
          return {
            type: account.platform,
            platformId: account.platform_id,
            username: account.platform_id,
            connected: true,
            createdAt: account.created_at
          };
        });
        
        setUserData({
          wallet: {
            id: mainWallet.id,
            publicKey: mainWallet.public_key,
            isCustodial: mainWallet.is_custodial,
            balance: solanaBalance,
            createdAt: mainWallet.created_at,
            updatedAt: mainWallet.updated_at
          },
          platforms,
          transactions: response.data.transactions
        });
      } else {
        throw new Error("Failed to load user profile data");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (
        errorMessage.includes("User profile not found") || 
        errorMessage.includes("404") || 
        errorMessage.includes("not found")
      ) {
        setShowAccountInfo(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserProfile();
      fetchWalletBalance();
      const intervalId = setInterval(fetchWalletBalance, 30000);
      return () => clearInterval(intervalId);
    } else {
      setUserData(null);
      setIsLoading(false);
      setShowAccountInfo(false);
    }
  }, [connected, publicKey, connection]);
  
  const handleRefreshWallet = async () => {
    await fetchUserProfile();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container max-w-4xl mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {connected && publicKey ? (
            showAccountInfo ? (
              <Card className="border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10">
                <CardHeader>
                  <CardTitle className="text-white">Welcome to SolTipConnect!</CardTitle>
                  <CardDescription className="text-white/60">
                    Your wallet is not registered yet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-black/30 border border-purple-900/30 rounded-md p-4">
                      <h3 className="text-white font-medium mb-2 flex items-center">
                        <UserPlus className="mr-2 h-4 w-4 text-[#14F195]" />
                        Register your wallet
                      </h3>
                      <p className="text-white/60 mb-4">
                        To use SolTipConnect, you need to register your wallet address through one of our bots:
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
                          <MessageCircle className="h-5 w-5 text-[#5865F2]" />
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
                        How to register:
                      </p>
                      <ol className="list-decimal pl-5 space-y-2 text-white/60 mb-4">
                        <li>Connect with one of the bots above</li>
                        <li>Follow the bot's instructions to register your wallet</li>
                        <li>Use the command: <span className="bg-black/40 px-2 py-1 rounded font-mono text-xs">/register {publicKey.toString()}</span></li>
                        <li>Once registered, come back here and refresh</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleRefreshWallet} 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                  >
                    Refresh
                  </Button>
                </CardFooter>
              </Card>
            ) : userData ? (
              <WalletCard 
                address={userData.wallet.publicKey} 
                balance={userData.wallet.balance || 0} 
                isLoading={isLoading} 
                onRefresh={handleRefreshWallet}
              />
            ) : isLoading ? (
              <Card className="p-6 border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32 bg-purple-900/20" />
                    <Skeleton className="h-8 w-24 bg-purple-900/20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48 bg-purple-900/20" />
                    <Skeleton className="h-4 w-32 bg-purple-900/20" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 bg-purple-900/20" />
                    <Skeleton className="h-10 w-24 bg-purple-900/20" />
                  </div>
                </div>
              </Card>
            ) : null
          ) : (
            <Card className="border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10">
              <CardHeader>
                <CardTitle className="text-white">Connect Your Wallet</CardTitle>
                <CardDescription className="text-white/60">
                  Connect your Solana wallet to get started sending and receiving tips
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <p className="text-white/60">Click the "Select Wallet" button in the header to connect</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1">
          <Card className="border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10 h-full">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-white/60">
                Common actions you can perform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white">
                <a href="/send">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send Tip
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white">
                <a href="/connect">
                  <Twitter className="mr-2 h-4 w-4" />
                  Connect Platforms
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-black/40 border border-purple-900/30">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-800/50 data-[state=active]:text-white">Recent Transactions</TabsTrigger>
            <TabsTrigger value="connected" className="data-[state=active]:bg-purple-800/50 data-[state=active]:text-white">Connected Platforms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Card className="border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
                <CardDescription className="text-white/60">
                  Your most recent tips and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!connected ? (
                  <div className="text-center py-6">
                    <p className="text-white/60 mb-4">
                      Connect your wallet to see your transactions
                    </p>
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-6">
                    <p className="text-white/60">Loading transactions...</p>
                  </div>
                ) : userData?.transactions.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-white/60">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userData?.transactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="flex items-center justify-between p-4 rounded-lg border border-purple-900/30 bg-black/30"
                      >
                        <div className="flex items-center gap-3">
                          {tx.status === "pending" ? (
                            tx.sender_wallet_id === publicKey?.toString() ? (
                              <ArrowUpRight className="w-5 h-5 text-[#FF4D4D]" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-[#14F195]" />
                            )
                          ) : tx.status === "confirmed" ? (
                            <ArrowDownRight className="w-5 h-5 text-[#14F195]" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-[#FF4D4D]" />
                          )}
                          
                          <div>
                            <p className="font-medium text-white">
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </p>
                            <p className="text-sm text-white/60">
                              {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-medium ${
                            tx.senderWalletId === publicKey?.toString() ? "text-[#FF4D4D]" : "text-[#14F195]"
                          }`}>
                            {tx.sender_wallet_id === publicKey?.toString() ? "-" : "+"}{tx.amount} {tx.token_symbol}
                          </p>
                          <p className="text-xs text-white/60">
                            {tx.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="connected">
            <Card className="border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10">
              <CardHeader>
                <CardTitle className="text-white">Connected Platforms</CardTitle>
                <CardDescription className="text-white/60">
                  Social media accounts linked to your wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!connected ? (
                  <div className="text-center py-6">
                    <p className="text-white/60 mb-4">
                      Connect your wallet to see your linked platforms
                    </p>
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-6">
                    <p className="text-white/60">Loading platforms...</p>
                  </div>
                ) : userData?.platforms.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-white/60 mb-4">No platforms connected yet</p>
                    <Button asChild variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
                      <a href="/connect">Connect Platforms</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userData?.platforms.map((platform) => {
                      const opt = platformOptions.find((p) => p.value === platform.type);
                      if (!opt) return null;
                      
                      const Icon = opt.icon;
                      return (
                        <div
                          key={platform.type}
                          className="flex items-center justify-between p-4 rounded-lg border border-purple-900/30 bg-black/30"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" style={{ color: opt.color }} />
                            <div>
                              <p className="font-medium text-white">{opt.label}</p>
                              <p className="text-sm text-white/60">@{platform.username}</p>
                            </div>
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full bg-[#14F195]/10 text-[#14F195]">
                            Connected
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
