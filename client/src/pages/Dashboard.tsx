import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Twitter, MessageCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { WalletCard } from "@/components/WalletCard";
import { api, UserProfile, PlatformType, Transaction } from "@/lib/api";
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

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    try {
      const profile = await api.user.getProfile(publicKey.toString());
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
      setIsLoading(false);
    }
  }, [connected, publicKey]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container max-w-4xl mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {connected && publicKey && userProfile ? (
            <WalletCard 
              address={userProfile.wallet.publicKey} 
              balance={userProfile.wallet.balance} 
              isLoading={isLoading} 
            />
          ) : (
            <Card className="backdrop-blur-xl bg-background/30">
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  Connect your Solana wallet to get started sending and receiving tips
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <p className="text-muted-foreground">Click the "Select Wallet" button in the header to connect</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1">
          <Card className="backdrop-blur-xl bg-background/30 h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions you can perform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <a href="/send">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send Tip
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
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
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="connected">Connected Platforms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Card className="backdrop-blur-xl bg-background/30">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your most recent tips and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!connected ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      Connect your wallet to see your transactions
                    </p>
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Loading transactions...</p>
                  </div>
                ) : userProfile?.transactions.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userProfile?.transactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          {tx.type === "tip" ? (
                            tx.senderWalletId === publicKey?.toString() ? (
                              <ArrowUpRight className="w-5 h-5 text-red-500" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-green-500" />
                            )
                          ) : tx.type === "deposit" ? (
                            <ArrowDownRight className="w-5 h-5 text-green-500" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-red-500" />
                          )}
                          
                          <div>
                            <p className="font-medium">
                              {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-medium ${
                            tx.senderWalletId === publicKey?.toString() ? "text-red-500" : "text-green-500"
                          }`}>
                            {tx.senderWalletId === publicKey?.toString() ? "-" : "+"}{tx.amount} {tx.tokenSymbol}
                          </p>
                          <p className="text-xs text-muted-foreground">
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
            <Card className="backdrop-blur-xl bg-background/30">
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <CardDescription>
                  Social media accounts linked to your wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!connected ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      Connect your wallet to see your linked platforms
                    </p>
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Loading platforms...</p>
                  </div>
                ) : userProfile?.platforms.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">No platforms connected yet</p>
                    <Button asChild variant="default" size="sm">
                      <a href="/connect">Connect Platforms</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userProfile?.platforms.map((platform) => {
                      const opt = platformOptions.find((p) => p.value === platform.type);
                      if (!opt) return null;
                      
                      const Icon = opt.icon;
                      return (
                        <div
                          key={platform.type}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" style={{ color: opt.color }} />
                            <div>
                              <p className="font-medium">{opt.label}</p>
                              <p className="text-sm text-muted-foreground">@{platform.username}</p>
                            </div>
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Connected
                          </div>
                        </div>
                      );
                    })}
                    <Button asChild variant="outline" size="sm" className="w-full mt-4">
                      <a href="/connect">Manage Platforms</a>
                    </Button>
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
