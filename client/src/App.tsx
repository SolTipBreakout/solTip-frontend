import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import SendTip from "@/pages/SendTip";
import WalletManagement from "@/pages/WalletManagement";
import ConnectPlatforms from "@/pages/ConnectPlatforms";
import TransactionHistory from "@/pages/TransactionHistory";
import { WalletProvider } from "@/contexts/WalletContext";

function Router() {
  const [location] = useLocation();

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/send" component={SendTip} />
        <Route path="/wallet" component={WalletManagement} />
        <Route path="/connect" component={ConnectPlatforms} />
        <Route path="/transactions" component={TransactionHistory} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <Toaster />
          <Router />
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
