import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import ConnectWalletModal from "@/components/ConnectWalletModal";

export default function SendTip() {
  const { isConnected, sendTip } = useWallet();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState("twitter");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setIsModalOpen(true);
      return;
    }
    
    if (!recipient || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please enter both recipient and amount",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await sendTip(recipient, parseFloat(amount), platform, message);
      
      toast({
        title: "Success!",
        description: `Successfully sent ${amount} SOL to ${recipient}`,
      });
      
      // Reset form
      setRecipient("");
      setAmount("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send tip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetAmount = (value: string) => {
    setAmount(value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Send a Tip</h1>
        <p className="text-gray-500 dark:text-gray-400">Send SOL tips to users across social platforms</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Platform Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Platform</label>
            <div className="grid grid-cols-3 gap-4">
              <div className="relative">
                <input 
                  type="radio" 
                  id="platform-twitter" 
                  name="platform" 
                  className="peer absolute opacity-0" 
                  checked={platform === "twitter"} 
                  onChange={() => setPlatform("twitter")} 
                />
                <label 
                  htmlFor="platform-twitter" 
                  className="flex flex-col items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-[#9945FF] transition-colors"
                >
                  <i className="fab fa-twitter text-2xl text-blue-400 mb-2"></i>
                  <span className="text-sm">Twitter</span>
                </label>
              </div>
              
              <div className="relative">
                <input 
                  type="radio" 
                  id="platform-discord" 
                  name="platform" 
                  className="peer absolute opacity-0" 
                  checked={platform === "discord"} 
                  onChange={() => setPlatform("discord")} 
                />
                <label 
                  htmlFor="platform-discord" 
                  className="flex flex-col items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-[#9945FF] transition-colors"
                >
                  <i className="fab fa-discord text-2xl text-indigo-500 mb-2"></i>
                  <span className="text-sm">Discord</span>
                </label>
              </div>
              
              <div className="relative">
                <input 
                  type="radio" 
                  id="platform-telegram" 
                  name="platform" 
                  className="peer absolute opacity-0" 
                  checked={platform === "telegram"} 
                  onChange={() => setPlatform("telegram")} 
                />
                <label 
                  htmlFor="platform-telegram" 
                  className="flex flex-col items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-[#9945FF] transition-colors"
                >
                  <i className="fab fa-telegram text-2xl text-blue-500 mb-2"></i>
                  <span className="text-sm">Telegram</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Recipient Information */}
          <div className="mb-6">
            <label htmlFor="recipient" className="block text-sm font-medium mb-2">Recipient Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="username"
                className="w-full py-3 pl-8 pr-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9945FF] focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Amount Selection */}
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium mb-2">Amount</label>
            <div className="relative">
              <Input
                type="number"
                id="amount"
                min="0.000001"
                step="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full py-3 pl-3 pr-16 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9945FF] focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="font-medium text-gray-500 dark:text-gray-400">SOL</span>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <button type="button" onClick={() => handleSetAmount("0.1")} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">0.1</button>
              <button type="button" onClick={() => handleSetAmount("0.5")} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">0.5</button>
              <button type="button" onClick={() => handleSetAmount("1.0")} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">1.0</button>
              <button type="button" onClick={() => handleSetAmount("5.0")} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">5.0</button>
              <button type="button" onClick={() => handleSetAmount("10.0")} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">10.0</button>
            </div>
          </div>
          
          {/* Message (Optional) */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium mb-2">Message (Optional)</label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9945FF] focus:border-transparent"
            />
          </div>
          
          {/* Transaction Fee */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Network Fee</span>
              <span className="text-sm font-medium">~0.000005 SOL</span>
            </div>
          </div>
          
          {/* Send Button */}
          <Button
            type="submit"
            disabled={!isConnected || isSubmitting}
            className="w-full py-3 gradient-button text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnected ? 'Send Tip' : 'Connect Wallet to Send Tip'}
          </Button>
          
          {/* Security Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">All transactions are secure and processed on the Solana blockchain.</p>
          </div>
        </form>
      </div>

      <ConnectWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
