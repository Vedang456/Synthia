import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ReputationGauge } from "./ReputationGauge";
import { NFTCard } from "./NFTCard";
import { ActivityTimeline } from "./ActivityTimeline";
import { ContractInteraction } from "./ContractInteraction";
import { WalletConnect } from "./WalletConnect";
import { RefreshCw, Sparkles } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useSynthiaContract } from "@/hooks/useSynthiaContract";
import { toast } from "sonner";

// Demo mode for when contracts aren't deployed
const DEMO_MODE = process.env.NODE_ENV === 'development' || !process.env.VITE_SYNTHIA_CONTRACT_ADDRESS;

export const Dashboard = () => {
  const { address } = useWeb3();
  const { getUserScore, requestScoreUpdate, isLoading, checkPendingUpdate } = useSynthiaContract();
  const [score, setScore] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (address) {
      // Load user score when wallet is connected
      const loadData = async () => {
        const scoreData = await getUserScore(address, score);
        if (scoreData) {
          setScore(scoreData.score);
          setLastUpdated(new Date(scoreData.lastUpdated * 1000));
        }

        const pending = await checkPendingUpdate();
        setIsPending(pending);
      };
      loadData();
    } else {
      // Demo mode - show sample data even without wallet connection
      setScore(750);
      setLastUpdated(new Date(Date.now() - 2 * 60 * 60 * 1000)); // 2 hours ago
      setIsPending(false);
    }
  }, [address]); // Simplified dependency array

  const handleRequestUpdate = async () => {
    const success = await requestScoreUpdate();
    if (success) {
      setIsPending(true);

      // In demo mode, simulate update completion after delay
      if (DEMO_MODE) {
        setTimeout(() => {
          setIsPending(false);
          // Update score to simulate the update
          const newScore = Math.floor(Math.random() * 800) + 100;
          setScore(newScore);
          setLastUpdated(new Date());
        }, 3000); // 3 second delay to simulate processing
      }

      toast.info("ASI agent will process your request shortly");
    }
  };

  return (
    <div className="min-h-screen cyber-grid">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <img 
                src="/favicon.ico" 
                alt="Synthia Logo" 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h1 className="text-4xl font-bold glow-text">Your Reputation Dashboard</h1>
                <p className="text-muted-foreground">
                  Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            </div>
            <WalletConnect />
          </div>
          {isPending && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/50 text-sm text-secondary">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Score update pending...
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Reputation Score */}
          <div className="lg:col-span-2">
            <ReputationGauge score={score} />
            
            <div className="mt-6 flex gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="flex-1"
                onClick={handleRequestUpdate}
                disabled={isLoading || isPending}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Request Score Update
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                if (address) {
                  const refreshData = async () => {
                    const scoreData = await getUserScore(address, score);
                    if (scoreData) {
                      setScore(scoreData.score);
                      setLastUpdated(new Date(scoreData.lastUpdated * 1000));
                    }

                    const pending = await checkPendingUpdate();
                    setIsPending(pending);
                  };
                  refreshData();
                }
              }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* NFT Card */}
          <div>
            <NFTCard score={score} walletAddress={address} lastUpdated={lastUpdated?.toLocaleDateString()} />
          </div>
        </div>

        {/* Contract Interaction & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContractInteraction />
          <ActivityTimeline 
            currentScore={score} 
            lastUpdated={lastUpdated} 
            walletAddress={address}
          />
        </div>

        {/* Info Section */}
        <div className="mt-6">
          <div className="p-6 bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-primary glow-text">About Your Score</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Your reputation score is calculated by ASI agents based on comprehensive analysis of your on-chain activities.
              </p>
              <p>
                Factors include transaction history, smart contract interactions, token holdings, and participation in DeFi protocols.
              </p>
              <p>
                Your Soulbound NFT is a permanent, non-transferable representation of your reputation that can be verified across all Web3 applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
