import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { WalletContextProvider } from '@/lib/WalletContextProvider';
import Dashboard from '@/pages/Dashboard';
import SendTip from '@/pages/SendTip';
import ConnectPlatforms from '@/pages/ConnectPlatforms';

function App() {
  return (
    <WalletContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/send" element={<SendTip />} />
          <Route path="/connect" element={<ConnectPlatforms />} />
        </Routes>
        <Toaster />
      </Router>
    </WalletContextProvider>
  );
}

export default App;
