import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ReputationGauge } from "@/components/ReputationGauge";
import { Navbar } from "@/components/Navbar";
import { RefreshCw, Sparkles } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useSynthiaContract } from "@/hooks/useSynthiaContract";
import { useDemoData } from "@/hooks/useDemoData";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";

const DEMO_MODE = process.env.NODE_ENV === 'development' || !process.env.VITE_SYNTHIA_CONTRACT_ADDRESS;

export const ScorePage = () => {
  const { address, isConnected } = useWeb3();
  const { getUserScore, requestScoreUpdate, isLoading, checkPendingUpdate, getASIAgent } = useSynthiaContract();
  const { currentDemoWallet, setCurrentDemoWallet, simulateAnalysis, wallets } = useDemoData();

  const [score, setScore] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      const loadData = async () => {
        try {
          const scoreData = await getUserScore(address, score);
          if (scoreData) {
            setScore(scoreData.score);
          }

          const pending = await checkPendingUpdate();
          setIsPending(pending);
        } catch (error) {
          console.error('Error loading score data:', error);
          // Fallback to demo data
          setScore(currentDemoWallet.score);
          setIsPending(false);
        }
      };
      loadData();
    } else {
      setScore(currentDemoWallet.score);
      setIsPending(false);
    }
  }, [address, currentDemoWallet, getUserScore, checkPendingUpdate, score, isConnected]);

  const handleRequestUpdate = async () => {
    if (DEMO_MODE || !isConnected) {
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

    try {
      // Check if ASI agent is deployed for the current account
      const asiAgent = await getASIAgent();

      if (asiAgent && asiAgent !== '0x0000000000000000000000000000000000000000') {
        // Full demo simulation with agent coordination
        toast({
          description: "🚀 ASI Agent detected! Starting comprehensive demo simulation...",
          variant: "info"
        });

        setIsAnalyzing(true);

        // Phase 1: Chat Agent → Orchestrator
        setTimeout(() => {
          toast({
            description: "🤖 ASI:One Chat Agent processing request...",
            variant: "info"
          });
        }, 500);

        // Phase 2: Orchestrator coordinates analysis
        setTimeout(() => {
          toast({
            description: "🎯 Orchestrator coordinating multi-agent analysis...",
            variant: "info"
          });
        }, 2000);

        // Phase 3: Wallet Analyzer examines blockchain data
        setTimeout(() => {
          toast({
            description: "🔍 Wallet Analyzer examining on-chain activity...",
            variant: "info"
          });
        }, 4000);

        // Phase 4: MeTTa Engine applies reasoning
        setTimeout(() => {
          toast({
            description: "🧠 MeTTa Engine applying symbolic reasoning rules...",
            variant: "info"
          });
        }, 6000);

        // Phase 5: Blockchain Agent prepares transaction
        setTimeout(() => {
          toast({
            description: "⛓️ Blockchain Agent preparing smart contract update...",
            variant: "info"
          });
        }, 8000);

        // Phase 6: Transaction submitted and confirmed
        setTimeout(async () => {
          const success = await requestScoreUpdate();
          if (success) {
            setIsPending(true);
            toast({
              description: "✅ Demo completed! Transaction submitted with full agent coordination",
              variant: "success"
            });
          } else {
            toast({ description: "❌ Demo simulation completed but transaction failed", variant: "destructive" });
          }
          setIsAnalyzing(false);
        }, 10000);

      } else {
        // Regular demo mode without agents
        toast({
          description: "🔧 No ASI Agent deployed. Running standard demo simulation...",
          variant: "info"
        });

        setIsAnalyzing(true);
        await simulateAnalysis(currentDemoWallet.address);

        // Simulate transaction submission
        setTimeout(async () => {
          const success = await requestScoreUpdate();
          if (success) {
            setIsPending(true);
            toast({
              description: "✅ Demo completed! Score update requested",
              variant: "success"
            });
          } else {
            toast({ description: "❌ Demo completed but transaction failed", variant: "destructive" });
          }
          setIsAnalyzing(false);
        }, 3000);
      }
    } catch (error) {
      toast({ description: "Error in demo simulation", variant: "destructive" });
      setIsAnalyzing(false);
    }
  };

  const handleDemoWalletSwitch = (walletAddress: string) => {
    const wallet = wallets.find(w => w.address === walletAddress);
    if (wallet) {
      setCurrentDemoWallet(wallet);
      setScore(wallet.score);
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
                <span className="text-lg font-medium text-primary">Demo Wallets</span>
              </div>
              <div className="space-y-3">
                <Select
                  value={currentDemoWallet.address}
                  onValueChange={handleDemoWalletSwitch}
                >
                  <SelectTrigger className="bg-card/50 border-primary/30 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
                    <SelectValue placeholder="Select a demo wallet" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-sm border-primary/30">
                    {wallets.map(wallet => (
                      <SelectItem
                        key={wallet.address}
                        value={wallet.address}
                        className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Score: {wallet.score}
                            </span>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            wallet.score >= 80 ? 'bg-green-500' :
                            wallet.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select different demo wallets to see how reputation scores vary across different user profiles.
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
