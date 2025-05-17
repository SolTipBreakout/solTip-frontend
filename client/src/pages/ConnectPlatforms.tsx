import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Twitter, 
  MessageCircle, 
  Plus, 
  Loader2, 
  X, 
  XCircle, 
  Wallet, 
  RefreshCw 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { api, PlatformType, Platform } from "@/lib/api";

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
  { value: "telegram", label: "Telegram", icon: TelegramIcon, color: "#0088cc" },
] as const;

// Interface for our custom platform display
interface PlatformDisplay {
  id: string;
  type: PlatformType;
  name: string;
  username: string;
  connected: boolean;
}

export default function ConnectPlatforms() {
  const { publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [platforms, setPlatforms] = useState<PlatformDisplay[]>([]);
  const [connectionLoading, setConnectionLoading] = useState<Record<string, boolean>>({});

  const fetchUserProfile = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const profile = await api.user.getProfile(publicKey.toString());
      
      // Create a list of platforms for display
      const platformList: PlatformDisplay[] = platformOptions.map(opt => ({
        id: opt.value,
        type: opt.value,
        name: opt.label,
        username: "",
        connected: false
      }));
      
      // Update connected platforms with user data
      if (profile.platforms) {
        profile.platforms.forEach(platform => {
          const index = platformList.findIndex(p => p.type === platform.type);
          if (index !== -1) {
            platformList[index].connected = true;
            platformList[index].username = platform.username;
          }
        });
      }
      
      setPlatforms(platformList);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsError(true);
      toast.error("Failed to load your connected platforms");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = () => {
    fetchUserProfile();
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [connected, publicKey]);

  const handlePlatformAction = async (platform: PlatformDisplay) => {
    if (!connected || !publicKey) return;
    
    setConnectionLoading(prev => ({
      ...prev,
      [platform.id]: true
    }));
    
    try {
      if (platform.connected) {
        // Disconnect platform
        await api.platform.disconnect(platform.type);
        setPlatforms(prev => 
          prev.map(p => 
            p.id === platform.id 
              ? { ...p, connected: false, username: "" } 
              : p
          )
        );
        toast.success(`Disconnected from ${platform.name}`);
      } else {
        // Connect platform - this would typically redirect to OAuth flow
        // For demo purposes, we'll simulate a connection with a dummy username
        const dummyUsername = `user_${Math.floor(Math.random() * 1000)}`;
        await api.platform.connect(platform.type, dummyUsername);
        setPlatforms(prev => 
          prev.map(p => 
            p.id === platform.id 
              ? { ...p, connected: true, username: dummyUsername } 
              : p
          )
        );
        toast.success(`Connected to ${platform.name} as @${dummyUsername}`);
      }
    } catch (error) {
      console.error(`Error ${platform.connected ? 'disconnecting' : 'connecting'} platform:`, error);
      toast.error(`Failed to ${platform.connected ? 'disconnect' : 'connect'} ${platform.name}`);
    } finally {
      setConnectionLoading(prev => ({
        ...prev,
        [platform.id]: false
      }));
    }
  };

  // Function to get the appropriate icon based on platform type
  const getPlatformIcon = (type: PlatformType) => {
    switch (type) {
      case 'twitter':
        return <Twitter className="w-5 h-5 text-white" />;
      case 'telegram':
        return <TelegramIcon className="w-5 h-5 text-white" />;
      default:
        return <MessageCircle className="w-5 h-5 text-white" />;
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
          <CardTitle className="text-white">Connect Your Platforms</CardTitle>
          <CardDescription className="text-white/60">
            Link your social media accounts to receive tips via username
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center p-6">
                <Loader2 className="animate-spin h-8 w-8 mx-auto text-[#14F195] mb-4" />
                <p className="text-white/60">Loading connected platforms...</p>
              </div>
            ) : isError ? (
              <div className="text-center p-6 bg-opacity-40 bg-black/20 border border-purple-900/20 rounded-md">
                <XCircle className="h-8 w-8 mx-auto text-red-500 mb-4" />
                <p className="text-white mb-4">Error loading connected platforms</p>
                <Button 
                  variant="outline" 
                  onClick={refreshProfile}
                  className="border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            ) : !connected ? (
              <div className="text-center p-6 bg-opacity-40 bg-black/20 border border-purple-900/20 rounded-md">
                <Wallet className="h-8 w-8 mx-auto text-[#9945FF] mb-4" />
                <p className="text-white mb-4">Connect your wallet to link platforms</p>
              </div>
            ) : (
              <div className="space-y-6">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="p-4 flex items-center justify-between border border-purple-900/20 rounded-lg bg-black/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]">
                        {getPlatformIcon(platform.type)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{platform.name}</p>
                        {platform.connected ? (
                          <p className="text-sm text-[#14F195]">
                            Connected as @{platform.username}
                          </p>
                        ) : (
                          <p className="text-sm text-white/60">Not connected</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlatformAction(platform)}
                      disabled={connectionLoading[platform.id] || !connected}
                      className={platform.connected 
                        ? "border-red-800/50 bg-red-950/30 text-red-300 hover:bg-red-950/50 hover:text-red-200" 
                        : "border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white"
                      }
                    >
                      {connectionLoading[platform.id] ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : platform.connected ? (
                        <X className="mr-2 h-4 w-4" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      {platform.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
