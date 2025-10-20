import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/contexts/Web3Context";
import { ChatProvider } from "@/contexts/ChatContext";
import { AIAgentOverlay } from "@/components/AIAgentOverlay";
import { ScoreProvider } from "@/contexts/ScoreContext";
import Index from "./pages/Index";
import Docs from "./pages/Docs";
import ScorePage from "./pages/ScorePage";
import NFTPage from "./pages/NFTPage";
import InfoPage from "./pages/InfoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Web3Provider>
        <ScoreProvider>
          <ChatProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/score" element={<ScorePage />} />
                <Route path="/nft" element={<NFTPage />} />
                <Route path="/info" element={<InfoPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AIAgentOverlay />
            </TooltipProvider>
          </ChatProvider>
        </ScoreProvider>
      </Web3Provider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
