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
  RefreshCw,
  UserPlus,
  FileText,
  ExternalLink
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { api, PlatformConnection, PlatformType } from "@/lib/api";

const TelegramIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

interface PlatformOptions {
  id: PlatformType;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  buttonText: string;
  userName?: string; // User name if connected
}

export default function ConnectPlatforms() {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [platformConnections, setPlatformConnections] = useState<PlatformConnection[]>([]);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const { toast } = useToast();

  // Platform options with descriptions
  const platforms: PlatformOptions[] = [
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      description: "Connect your Twitter account to send and receive SOL tips.",
      color: "#1DA1F2",
      buttonText: "Connect with Twitter",
    },
    {
      id: "discord",
      name: "Discord",
      icon: MessageCircle,
      description: "Connect your Discord account to send and receive SOL tips.",
      color: "#5865F2",
      buttonText: "Connect with Discord",
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: TelegramIcon,
      description: "Connect your Telegram account to send and receive SOL tips.",
      color: "#0088cc",
      buttonText: "Connect with Telegram",
    },
  ];

  // Effect to load user's connected platforms when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      loadConnectedPlatforms();
    }
  }, [connected, publicKey]);

  const loadConnectedPlatforms = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      // Reset the registration flag whenever we try to load platforms
      setNeedsRegistration(false);
      
      // Get user connections
      const response = await api.user.connections(publicKey.toString());
      setPlatformConnections(response.connections || []);
    } catch (error) {
      console.error("Failed to load connected platforms:", error);
      
      // Check if the error message indicates the user profile doesn't exist
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (
        errorMessage.includes("User profile not found") || 
        errorMessage.includes("404") || 
        errorMessage.includes("not found")
      ) {
        setNeedsRegistration(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load connected platforms",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setNeedsRegistration(false);
    if (publicKey) {
      loadConnectedPlatforms();
    }
  };

  // Check if a platform is connected
  const isPlatformConnected = (platformId: PlatformType) => {
    return platformConnections.some(conn => conn.platform === platformId);
  };

  // Update platforms with connection status
  const platformsWithStatus = platforms.map(platform => ({
    ...platform,
    isConnected: isPlatformConnected(platform.id),
    // Get username if connected
    userName: platformConnections.find(conn => conn.platform === platform.id)?.platformId
  }));

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
              You need to register your wallet before connecting platforms
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
                  <li>Once registered, you can return here to connect your social platforms</li>
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
      className="container max-w-3xl mx-auto px-4 py-8"
    >
      <Card className="border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10">
        <CardHeader>
          <CardTitle className="text-white">Connect Platforms</CardTitle>
          <CardDescription className="text-white/60">
            Connect your social accounts to send and receive SOL tips
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!connected ? (
            <div className="text-center py-6">
              <div className="mb-4">
                <FileText className="mx-auto h-12 w-12 text-white/30" />
              </div>
              <h3 className="text-white font-medium mb-2">Connect your wallet first</h3>
              <p className="text-white/60">
                Please connect your Solana wallet to view and manage your platform connections.
              </p>
            </div>
          ) : loading ? (
            <div className="text-center py-6">
              <p className="text-white/60">Loading your platform connections...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {platformsWithStatus.map((platform) => (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-purple-900/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}30` }}
                    >
                      <platform.icon className="h-5 w-5" style={{ color: platform.color }} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{platform.name}</h3>
                      {platform.isConnected ? (
                        <p className="text-[#14F195] text-sm">
                          Connected as @{platform.userName}
                        </p>
                      ) : (
                        <p className="text-white/60 text-sm">{platform.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {platform.isConnected ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white"
                      disabled
                    >
                      Connected
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      asChild
                    >
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        toast({
                          title: "Coming soon",
                          description: `Platform connections can currently only be made via the ${platform.name} bot`,
                        });
                      }}>
                        {platform.buttonText}
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-white/60 text-center w-full">
            Your platform connections are linked securely to your Solana wallet.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
