import { useState, useEffect } from 'react';

export interface DemoWallet {
  address: string;
  score: number;
  tier: string;
  transactionScore: number;
  defiScore: number;
  securityScore: number;
  socialScore: number;
  nftTokenId: string;
  lastUpdated: Date;
  activities: ActivityItem[];
  mettaReasoning: MeTTaReasoning;
}

export interface ActivityItem {
  id: string;
  type: 'analysis' | 'nft_mint' | 'score_update' | 'batch_analysis' | 'comparison' | 'nft_update' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  scoreChange?: number;
  details?: Record<string, unknown>;
}

export interface MeTTaReasoning {
  appliedRules: string[];
  reasoning: string;
  scoreAdjustments: number;
  reputationLevel: string;
  recommendations: string[];
  warnings: string[];
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'communicating' | 'completed';
  currentTask?: string;
  progress?: number;
}

const DEMO_WALLETS: DemoWallet[] = [
  {
    address: '0x7036f3C8022636F4137f2c425E6af9c9e34EEA98',
    score: 850,
    tier: 'Platinum',
    transactionScore: 88,
    defiScore: 92,
    securityScore: 90,
    socialScore: 85,
    nftTokenId: '1',
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
    mettaReasoning: {
      appliedRules: ['experienced_defi_user', 'excellent_reputation', 'security_focused'],
      reasoning: 'Active Hedera ecosystem participant with strong DeFi engagement, excellent security practices, and growing social presence. Consistent high-value transactions and protocol participation demonstrate sophisticated understanding of Web3.',
      scoreAdjustments: 100,
      reputationLevel: 'Excellent',
      recommendations: ['Continue DeFi diversification', 'Consider governance participation'],
      warnings: []
    },
    activities: [
      {
        id: '1',
        type: 'analysis',
        title: 'Wallet Analysis Completed',
        description: 'Comprehensive analysis of Hedera ecosystem participation',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        scoreChange: 15
      },
      {
        id: '2',
        type: 'nft_update',
        title: 'NFT Badge Updated',
        description: 'Soulbound NFT refreshed with latest reputation data',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
      },
      {
        id: '3',
        type: 'score_update',
        title: 'Score Improved',
        description: 'Recent DeFi activity enhanced reputation metrics',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        scoreChange: 25
      }
    ]
  }
];

const DEMO_AGENT_STATUSES: AgentStatus[] = [
  { id: '1', name: 'ASI:One Chat', status: 'idle' },
  { id: '2', name: 'Orchestrator', status: 'idle' },
  { id: '3', name: 'Wallet Analyzer', status: 'idle' },
  { id: '4', name: 'MeTTa Engine', status: 'idle' },
  { id: '5', name: 'Blockchain Agent', status: 'idle' },
  { id: '6', name: 'A2A Marketplace', status: 'idle' }
];

export const useDemoData = () => {
  const [wallets, setWallets] = useState<DemoWallet[]>(DEMO_WALLETS);
  const [agents, setAgents] = useState<AgentStatus[]>(DEMO_AGENT_STATUSES);
  const [currentDemoWallet, setCurrentDemoWallet] = useState<DemoWallet>(DEMO_WALLETS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate agent coordination during analysis
  const simulateAnalysis = async (walletAddress: string, duration: number = 15000) => {
    setIsAnalyzing(true);

    const wallet = wallets.find(w => w.address === walletAddress) || currentDemoWallet;

    // Phase 1: ASI:One Chat → Orchestrator
    setTimeout(() => {
      setAgents(prev => prev.map(agent =>
        agent.id === '1' ? { ...agent, status: 'working', currentTask: 'Processing chat request' } : agent
      ));
    }, 500);

    setTimeout(() => {
      setAgents(prev => prev.map(agent =>
        agent.id === '1' ? { ...agent, status: 'communicating' } :
        agent.id === '2' ? { ...agent, status: 'working', currentTask: 'Coordinating analysis' } : agent
      ));
    }, 1500);

    // Phase 2: Orchestrator → Wallet Analyzer
    setTimeout(() => {
      setAgents(prev => prev.map(agent =>
        agent.id === '2' ? { ...agent, status: 'communicating' } :
        agent.id === '3' ? { ...agent, status: 'working', currentTask: 'Analyzing wallet data' } : agent
      ));
    }, 3000);

    // Phase 3: Wallet Analyzer → MeTTa Engine
    setTimeout(() => {
      setAgents(prev => prev.map(agent =>
        agent.id === '3' ? { ...agent, status: 'communicating' } :
        agent.id === '4' ? { ...agent, status: 'working', currentTask: 'Applying symbolic reasoning', progress: 0 } : agent
      ));
    }, 5000);

    // Simulate MeTTa progress
    const progressInterval = setInterval(() => {
      setAgents(prev => prev.map(agent =>
        agent.id === '4' && agent.progress !== undefined && agent.progress < 100
          ? { ...agent, progress: Math.min(agent.progress + 10, 100) }
          : agent
      ));
    }, 200);

    // Phase 4: MeTTa Engine → Blockchain Agent
    setTimeout(() => {
      clearInterval(progressInterval);
      setAgents(prev => prev.map(agent =>
        agent.id === '4' ? { ...agent, status: 'communicating', progress: 100 } :
        agent.id === '5' ? { ...agent, status: 'working', currentTask: 'Writing to blockchain' } : agent
      ));
    }, 10000);

    // Phase 5: Complete
    setTimeout(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: 'completed' as const,
        currentTask: undefined,
        progress: undefined
      })));

      // Update wallet score slightly
      const updatedWallet = {
        ...wallet,
        score: Math.min(1000, wallet.score + Math.floor(Math.random() * 30) + 5),
        lastUpdated: new Date()
      };

      setWallets(prev => prev.map(w => w.address === walletAddress ? updatedWallet : w));
      setCurrentDemoWallet(updatedWallet);
      setIsAnalyzing(false);
    }, duration);
  };

  const simulateComparison = async (walletAddresses: string[]) => {
    setIsAnalyzing(true);

    // Show orchestrator coordinating batch analysis
    setTimeout(() => {
      setAgents(prev => prev.map(agent =>
        agent.id === '2' ? { ...agent, status: 'working', currentTask: 'Coordinating batch analysis' } : agent
      ));
    }, 1000);

    setTimeout(() => {
      setAgents(prev => prev.map(agent =>
        agent.id === '3' ? { ...agent, status: 'working', currentTask: 'Batch processing wallets' } : agent
      ));
    }, 2000);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' })));
    }, 8000);
  };

  const resetDemo = () => {
    setWallets(DEMO_WALLETS);
    setCurrentDemoWallet(DEMO_WALLETS[0]);
    setAgents(DEMO_AGENT_STATUSES);
    setIsAnalyzing(false);
  };

  return {
    wallets,
    currentDemoWallet,
    setCurrentDemoWallet,
    agents,
    isAnalyzing,
    simulateAnalysis,
    simulateComparison,
    resetDemo
  };
};
