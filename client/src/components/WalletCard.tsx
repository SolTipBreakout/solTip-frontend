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
      <Card className="p-6 backdrop-blur-xl bg-background/30">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
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
      <Card className="p-6 backdrop-blur-xl bg-background/30">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Solana Wallet</h3>
            </div>
            <Button variant="outline" size="icon" onClick={handleOpenExplorer}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{address}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyAddress}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-2xl font-bold">{balance.toFixed(4)} SOL</p>
            <p className="text-xs text-muted-foreground">{(balance * LAMPORTS_PER_SOL).toLocaleString()} lamports</p>
          </div>

          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <a href="/send">
                <Send className="w-4 h-4 mr-2" />
                Send
              </a>
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowQR(true)}>
              <QrCode className="w-4 h-4 mr-2" />
              Receive
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive SOL</DialogTitle>
            <DialogDescription>
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
            <p className="text-sm text-center break-all mb-2">{address}</p>
            <Button variant="outline" size="sm" onClick={handleCopyAddress}>
              <Copy className="w-3 h-3 mr-2" />
              Copy Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 