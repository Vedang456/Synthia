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
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    score: 875,
    tier: 'Platinum',
    transactionScore: 92,
    defiScore: 88,
    securityScore: 95,
    socialScore: 78,
    nftTokenId: '1',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    mettaReasoning: {
      appliedRules: ['elite_defi_user', 'excellent_reputation', 'social_proof_verified'],
      reasoning: 'Wallet demonstrates exceptional DeFi participation with 15+ protocols, consistent high-value transactions, and verified social identity. Long-term holding patterns and security-conscious behavior contribute to elite reputation status.',
      scoreAdjustments: 125,
      reputationLevel: 'Excellent',
      recommendations: ['Continue DeFi diversification', 'Maintain security practices'],
      warnings: []
    },
    activities: [
      {
        id: '1',
        type: 'analysis',
        title: 'Comprehensive Analysis Completed',
        description: 'ASI agents completed full wallet analysis using MeTTa reasoning',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        scoreChange: 25
      },
      {
        id: '2',
        type: 'nft_update',
        title: 'NFT Badge Updated',
        description: 'Soulbound NFT metadata refreshed with latest reputation data',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
      },
      {
        id: '3',
        type: 'score_update',
        title: 'Score Increased',
        description: 'Recent DeFi activity positively impacted reputation score',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        scoreChange: 45
      }
    ]
  },
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    score: 650,
    tier: 'Gold',
    transactionScore: 75,
    defiScore: 68,
    securityScore: 82,
    socialScore: 45,
    nftTokenId: '2',
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
    mettaReasoning: {
      appliedRules: ['emerging_user', 'high_volume_trader'],
      reasoning: 'New wallet showing promising early activity with good transaction volume and security practices. Moderate social presence suggests room for growth in community engagement.',
      scoreAdjustments: 50,
      reputationLevel: 'Good',
      recommendations: ['Increase social verification', 'Expand DeFi participation'],
      warnings: ['Limited social proof']
    },
    activities: [
      {
        id: '4',
        type: 'analysis',
        title: 'Wallet Analysis',
        description: 'Regular security and activity review completed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '5',
        type: 'nft_mint',
        title: 'NFT Minted',
        description: 'Synthia Soulbound NFT created for reputation tracking',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    score: 920,
    tier: 'Diamond',
    transactionScore: 96,
    defiScore: 94,
    securityScore: 98,
    socialScore: 92,
    nftTokenId: '3',
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
    mettaReasoning: {
      appliedRules: ['elite_defi_user', 'excellent_reputation', 'social_proof_verified', 'old_wallet_bonus', 'high_volume_trader'],
      reasoning: 'Exceptional wallet demonstrating mastery across all dimensions. Veteran user with extensive protocol experience, verified social identity, and impeccable security record. Elite status achieved through consistent excellence.',
      scoreAdjustments: 170,
      reputationLevel: 'Exceptional',
      recommendations: ['Consider protocol governance participation', 'Maintain security standards'],
      warnings: []
    },
    activities: [
      {
        id: '6',
        type: 'analysis',
        title: 'Elite Analysis Completed',
        description: 'Comprehensive analysis confirmed diamond-tier reputation',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        scoreChange: 15
      },
      {
        id: '7',
        type: 'achievement',
        title: 'Diamond Tier Achieved',
        description: 'Reached highest reputation tier with exceptional scores',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
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
