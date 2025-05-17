import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Dashboard from '@/pages/Dashboard';
import SendTip from '@/pages/SendTip';
import ConnectPlatforms from '@/pages/ConnectPlatforms';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#191c2a] via-[#13131f] to-[#0f1019]">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/send" element={<SendTip />} />
            <Route path="/connect" element={<ConnectPlatforms />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
