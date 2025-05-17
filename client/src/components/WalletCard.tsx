import { motion } from "framer-motion";
import { Copy, ExternalLink, Send, Wallet, QrCode } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface WalletCardProps {
  address: string;
  balance: number;
  isLoading?: boolean;
}

export function WalletCard({ address, balance, isLoading }: WalletCardProps) {
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy address:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy wallet address",
        variant: "destructive",
      });
    }
  };

  const handleOpenExplorer = () => {
    window.open(`https://explorer.solana.com/address/${address}?cluster=devnet`, "_blank");
  };

  if (isLoading) {
    return (
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 border-purple-900/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-purple-900/10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#9945FF]" />
              <h3 className="font-medium text-white">Solana Wallet</h3>
            </div>
            <Button variant="outline" size="icon" onClick={handleOpenExplorer} className="border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate text-white/90">{address}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-[#14F195] hover:bg-transparent" onClick={handleCopyAddress}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-2xl font-bold text-white bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">{balance.toFixed(4)} SOL</p>
            <p className="text-xs text-white/60">{(balance * LAMPORTS_PER_SOL).toLocaleString()} lamports</p>
          </div>

          <div className="flex gap-2">
            <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
              <a href="/send">
                <Send className="w-4 h-4 mr-2" />
                Send
              </a>
            </Button>
            <Button variant="outline" className="flex-1 border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white" onClick={() => setShowQR(true)}>
              <QrCode className="w-4 h-4 mr-2" />
              Receive
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="border-purple-900/30 bg-black/80 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Receive SOL</DialogTitle>
            <DialogDescription className="text-white/60">
              Scan this QR code to send SOL to this wallet
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="bg-white p-4 rounded-lg mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`} 
                alt="Wallet QR Code" 
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-center break-all mb-2 text-white/80">{address}</p>
            <Button variant="outline" size="sm" onClick={handleCopyAddress} className="border-purple-500/50 bg-purple-950/30 text-white hover:bg-purple-900/50 hover:text-white">
              <Copy className="w-3 h-3 mr-2" />
              Copy Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 