import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ReputationGauge } from "@/components/ReputationGauge";
import { Navbar } from "@/components/Navbar";
import { RefreshCw, Sparkles } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useSynthiaContract } from "@/hooks/useSynthiaContract";
import { useDemoData } from "@/hooks/useDemoData";
import { useScore } from "@/contexts/ScoreContext";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";

const DEMO_MODE = process.env.NODE_ENV === 'development' || !process.env.VITE_SYNTHIA_CONTRACT_ADDRESS;

export const ScorePage = () => {
  const { address, isConnected } = useWeb3();
  const { requestScoreUpdate, isLoading } = useSynthiaContract();
  const { currentDemoWallet, setCurrentDemoWallet, simulateAnalysis, wallets } = useDemoData();
  const { score, isPending, refreshScore, requestScoreUpdate: contextRequestScoreUpdate } = useScore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRequestUpdate = async () => {
    if (DEMO_MODE || !isConnected) {
      // Demo mode - run simulation
      setIsAnalyzing(true);
      try {
        await simulateAnalysis(currentDemoWallet.address);
        toast({ description: "Demo analysis completed!", variant: "success" });
      } catch (error) {
        toast({ description: "Analysis failed", variant: "destructive" });
      }
      setIsAnalyzing(false);
      return;
    }

    // Real wallet connected - use same pattern as ContractInteraction.tsx
    try {
      const success = await contextRequestScoreUpdate();
      if (success) {
        toast({ description: "Score update requested! Check wallet for transaction.", variant: "info" });
      } else {
        toast({ description: "Failed to request score update", variant: "destructive" });
      }
    } catch (error) {
      toast({ description: "Error requesting score update", variant: "destructive" });
    }
  };

  const handleDemoWalletSwitch = (walletAddress: string) => {
    const wallet = wallets.find(w => w.address === walletAddress);
    if (wallet) {
      setCurrentDemoWallet(wallet);
    }
  };

  // If not connected, show a connection prompt
  if (!isConnected) {
    return (
      <div className="min-h-screen cyber-grid relative overflow-hidden">
        <Navbar />

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold glow-text mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground mb-8">
              Please connect your wallet to view your reputation score and access all features.
            </p>
            <Link to="/">
              <Button variant="hero" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold glow-text mb-2">Reputation Score</h1>
            <p className="text-muted-foreground">
              {DEMO_MODE ? 'Demo Mode - Interactive Experience' : `Wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </p>
          </div>

          {/* Demo Wallet Selector - Only show in demo mode */}
          {DEMO_MODE && (
            <div className="mb-8 bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium text-primary">Demo Mode</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Demo wallet: {currentDemoWallet.address.slice(0, 6)}...{currentDemoWallet.address.slice(-4)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Connect your real wallet to see actual reputation scores and enable live transactions.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <ReputationGauge score={score} />

              <div className="flex gap-4">
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleRequestUpdate}
                  disabled={isLoading || isPending || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Request Score Update
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary">Score Information</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium">Current Score:</span> {score}
                </div>
                <div>
                  <span className="font-medium">Wallet:</span> {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {isPending ? 'Update Pending' : 'Active'}
                </div>
                <div>
                  <span className="font-medium">Mode:</span> {DEMO_MODE ? 'Demo' : 'Live'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
