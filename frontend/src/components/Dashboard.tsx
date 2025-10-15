import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ReputationGauge } from "./ReputationGauge";
import { NFTCard } from "./NFTCard";
import { ReputationInsights } from "./ReputationInsights";
import { ContractInteraction } from "./ContractInteraction";
import { WalletConnect } from "./WalletConnect";
import { ASIOneChatInterface } from "./ASIOneChatInterface";
import { LiveAgentVisualization } from "./LiveAgentVisualization";
import { DemoTourOverlay } from "./DemoTourOverlay";
import { RefreshCw, Sparkles, Play, Users, MessageSquare, Activity, Eye } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useSynthiaContract } from "@/hooks/useSynthiaContract";
import { useDemoData } from "@/hooks/useDemoData";
import { useDemoTour } from "@/hooks/useDemoTour";
import { showToast } from "@/lib/toast-utils";

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
  } = useDemoTour();

  const [score, setScore] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'agents' | 'analysis'>('overview');

  useEffect(() => {
    const handleOpenChat = () => setActiveTab('chat');
    const handleSwitchToAgents = () => setActiveTab('agents');
    const handleTriggerComparison = () => {
      // For demo purposes, just switch to chat tab where comparison can be initiated
      setActiveTab('chat');
    };
    const handleSwitchToAnalysis = () => setActiveTab('analysis');

    window.addEventListener('open-chat', handleOpenChat);
    window.addEventListener('switch-to-agents', handleSwitchToAgents);
    window.addEventListener('trigger-comparison', handleTriggerComparison);
    window.addEventListener('switch-to-analysis', handleSwitchToAnalysis);

    return () => {
      window.removeEventListener('open-chat', handleOpenChat);
      window.removeEventListener('switch-to-agents', handleSwitchToAgents);
      window.removeEventListener('trigger-comparison', handleTriggerComparison);
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
      showToast.success("Demo analysis completed!");
      return;
    }

    const success = await requestScoreUpdate();
    if (success) {
      setIsPending(true);
      showToast.info("ASI agent will process your request shortly");
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
    <div className="min-h-screen cyber-grid">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Demo Tour Button */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.ico"
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
              <WalletConnect />
            </div>
          </div>

          {/* Demo Wallet Selector */}
          {DEMO_MODE && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Demo Wallets:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {wallets.map(wallet => (
                  <Button
                    key={wallet.address}
                    variant={currentDemoWallet.address === wallet.address ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDemoWalletSwitch(wallet.address)}
                    className="text-xs"
                  >
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)} ({wallet.score})
                  </Button>
                ))}
              </div>
            </div>
          )}

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
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('chat')}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
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
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Reputation Score */}
              <div className="lg:col-span-2" data-tour="reputation-gauge">
                <ReputationGauge score={score} />

                <div className="mt-6 flex gap-4">
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    onClick={handleRequestUpdate}
                    disabled={isLoading || isPending || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : isLoading ? (
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
                  <Button variant="outline" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* NFT Card */}
              <div data-tour="nft-card">
                <NFTCard
                  score={score}
                  walletAddress={currentDemoWallet.address}
                  lastUpdated={lastUpdated?.toLocaleDateString()}
                />
              </div>
            </div>

            {/* Contract Interaction & Activity */}
            <div className="mb-8">
              <div data-tour="activity-timeline">
                <ReputationInsights
                  score={score}
                  walletAddress={currentDemoWallet.address}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'chat' && (
          <div className="mb-8" data-tour="chat-interface">
            <ASIOneChatInterface />
          </div>
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
