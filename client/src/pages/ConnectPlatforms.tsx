import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Twitter, MessageCircle, Plus, Loader2, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { api, PlatformType, UserProfile } from "@/lib/api";
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

export default function ConnectPlatforms() {
  const { publicKey, connected } = useWallet();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlatform, setNewPlatform] = useState<PlatformType>("twitter");
  const [newUsername, setNewUsername] = useState("");
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
        description: "Failed to load connected platforms",
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
    }
  }, [connected, publicKey]);

  const handleConnect = async (platform: PlatformType, username: string) => {
    if (!publicKey) return;
    
    try {
      await api.platform.connect(platform, username);
      await fetchUserProfile();
      toast({
        title: "Success",
        description: `Connected ${platform} account @${username}`,
      });
      setIsAdding(false);
      setNewUsername("");
    } catch (error) {
      console.error("Failed to connect platform:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect platform",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (platform: PlatformType) => {
    if (!publicKey) return;
    
    try {
      await api.platform.disconnect(platform);
      await fetchUserProfile();
      toast({
        title: "Success",
        description: `Disconnected ${platform} account`,
      });
    } catch (error) {
      console.error("Failed to disconnect platform:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect platform",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container max-w-2xl mx-auto px-4 py-8"
    >
      <Card className="backdrop-blur-xl bg-background/30">
        <CardHeader>
          <CardTitle>Link your social accounts</CardTitle>
          <CardDescription>
            Connect your social media accounts to receive tips through them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!connected ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Connect your wallet using the button in the header to manage platform connections
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {userProfile?.platforms?.map((platform) => {
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
                        <p className="text-sm text-muted-foreground">
                          @{platform.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDisconnect(platform.type)}
                    >
                      Disconnect
                    </Button>
                  </div>
                );
              })}

              {isAdding ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="flex gap-2">
                    {platformOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = newPlatform === opt.value;
                      const isConnected = userProfile?.platforms?.some(
                        (p) => p.type === opt.value
                      );
                      
                      if (isConnected) return null;
                      
                      return (
                        <Button
                          key={opt.value}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className={`flex-1 gap-2 ${
                            isSelected ? "" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setNewPlatform(opt.value)}
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

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex">
                        <div className="flex items-center bg-muted/50 border border-r-0 border-input rounded-l-md px-3">
                          <span className="text-muted-foreground">@</span>
                        </div>
                        <Input
                          placeholder="username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="rounded-none rounded-r-md"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => handleConnect(newPlatform, newUsername)}
                      disabled={!newUsername}
                    >
                      Connect
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <Button
                  onClick={() => setIsAdding(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Platform
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
