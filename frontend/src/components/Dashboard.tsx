import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ReputationGauge } from "./ReputationGauge";
import { NFTCard } from "./NFTCard";
import { ReputationInsights } from "./ReputationInsights";
import { ContractInteraction } from "./ContractInteraction";
import { WalletConnect } from "./WalletConnect";
import { LiveAgentVisualization } from "./LiveAgentVisualization";
import { DemoTourOverlay } from "./DemoTourOverlay";
import { Navbar } from "./Navbar";
import { RefreshCw, Sparkles, Play, Users, Activity, Eye } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useSynthiaContract } from "@/hooks/useSynthiaContract";
import { useDemoData } from "@/hooks/useDemoData";
import { useDemoTour } from "@/hooks/useDemoTour";
import DotGrid from "@/components/DotGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
// Demo mode for when contracts aren't deployed
const DEMO_MODE = process.env.NODE_ENV === 'development' || !process.env.VITE_SYNTHIA_CONTRACT_ADDRESS;

export const Dashboard = () => {
  const { address } = useWeb3();
  const { getUserScore, requestScoreUpdate, isLoading, checkPendingUpdate } = useSynthiaContract();
  const { currentDemoWallet, setCurrentDemoWallet, agents, isAnalyzing, simulateAnalysis, wallets } = useDemoData();
  const {
    isActive: tourActive,
    currentStep,
    isVisible: tourVisible,
    currentStepData,
    startTour,
    nextStep,
    prevStep,
    endTour,
    goToStep,
    totalSteps
  } = useDemoTour(() => setActiveTab('overview'));

  const [score, setScore] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'analysis'>('overview');

  useEffect(() => {
    const handleSwitchToAgents = () => setActiveTab('agents');
    const handleSwitchToAnalysis = () => setActiveTab('analysis');

    window.addEventListener('switch-to-agents', handleSwitchToAgents);
    window.addEventListener('switch-to-analysis', handleSwitchToAnalysis);

    return () => {
      window.removeEventListener('switch-to-agents', handleSwitchToAgents);
      window.removeEventListener('switch-to-analysis', handleSwitchToAnalysis);
    };
  }, []);

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
      setScore(currentDemoWallet.score);
      setLastUpdated(currentDemoWallet.lastUpdated);
      setIsPending(false);
    }
  }, [address, currentDemoWallet, getUserScore, checkPendingUpdate, score]);

  const handleRequestUpdate = async () => {
    if (DEMO_MODE) {
      // Demo mode: simulate analysis
      await simulateAnalysis(currentDemoWallet.address);
      toast({ description: "Demo analysis completed!", variant: "success" });
      return;
    }

    const success = await requestScoreUpdate();
    if (success) {
      setIsPending(true);
      toast({ description: "ASI agent will process your request shortly", variant: "info" });
    }
  };

  const handleDemoWalletSwitch = (walletAddress: string) => {
    const wallet = wallets.find(w => w.address === walletAddress);
    if (wallet) {
      setCurrentDemoWallet(wallet);
      setScore(wallet.score);
      setLastUpdated(wallet.lastUpdated);
    }
  };

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* DotGrid Background */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={8}
          gap={25}
          baseColor="#5227FF"
          activeColor="#7C3AED"
          proximity={100}
          shockRadius={200}
          shockStrength={3}
          resistance={800}
          returnDuration={2}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header with Demo Tour Button */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <img
                src="src/assets/Synthia.png"
                alt="Synthia Logo"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h1 className="text-4xl font-bold glow-text">Reputation Dashboard</h1>
                <p className="text-muted-foreground">
                  {DEMO_MODE ? 'Demo Mode - Interactive Experience' : `Wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={startTour}
                className="bg-primary/10 border-primary/50 text-primary hover:bg-primary/20"
              >
                <Play className="w-4 h-4 mr-2" />
                Demo Tour
              </Button>
            </div>
          </div>

          {isPending && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/50 text-sm text-secondary">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Score update pending...
            </div>
          )}
        </div>

        {/* Main Content Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('overview')}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'agents' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('agents')}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Agents
            </Button>
            <Button
              variant={activeTab === 'analysis' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('analysis')}
              className="flex-1"
            >
              <Activity className="w-4 h-4 mr-2" />
              Analysis
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">Dashboard Overview</h3>
              <p className="text-muted-foreground mb-6">
                Welcome to your Synthia Reputation Dashboard. Use the section buttons above to navigate to specific areas,
                or use the tabs below to access additional features like Chat, Agents, and Analysis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-4 text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold text-sm">Reputation Score</h4>
                  <p className="text-xs text-muted-foreground">View and update your current reputation score</p>
                </div>
                <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold text-sm">Soulbound NFT</h4>
                  <p className="text-xs text-muted-foreground">View your permanent reputation token</p>
                </div>
                <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-4 text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold text-sm">Activity Timeline</h4>
                  <p className="text-xs text-muted-foreground">Analyze your on-chain activity patterns</p>
                </div>
                <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-4 text-center">
                  <span className="text-2xl mb-2 block">⚙</span>
                  <h4 className="font-semibold text-sm">Technical Info</h4>
                  <p className="text-xs text-muted-foreground">Learn about AI reasoning and blockchain integration</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'agents' && (
          <div className="mb-8" data-tour="agent-visualization">
            <LiveAgentVisualization />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="mb-8" data-tour="batch-analysis">
            <ContractInteraction />
          </div>
        )}

        {/* Info Section moved to separate page */}
        <div className="mt-6">
          <div className="p-6 bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-primary">Need More Information?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For detailed technical information about MeTTa reasoning and Hedera blockchain integration,
                visit the dedicated Info page using the section selector above.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Tour Overlay */}
      <DemoTourOverlay
        isVisible={tourVisible}
        currentStep={currentStep}
        currentStepData={currentStepData}
        onNext={nextStep}
        onPrev={prevStep}
        onClose={endTour}
        onGoToStep={goToStep}
        totalSteps={totalSteps}
      />
    </div>
  );
};
