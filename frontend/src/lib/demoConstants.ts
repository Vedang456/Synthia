export interface DemoStep {
  id: string;
  title: string;
  description: string;
  target: string;
  action?: () => void;
  highlight?: string[];
  requiredTab?: 'overview' | 'chat' | 'agents' | 'analysis';
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Synthia! 🚀',
    description: 'Experience the future of decentralized reputation powered by ASI Alliance agents, MeTTa reasoning, and Hedera blockchain.',
    target: 'body'
  },
  {
    id: 'wallet-connection',
    title: 'Connect Your Wallet',
    description: 'Connect any Web3 wallet to get your personalized reputation dashboard with real-time score tracking.',
    target: '[data-tour="wallet-connect"]'
  },
  {
    id: 'reputation-gauge',
    title: 'Your Reputation Score',
    description: 'See your comprehensive reputation score calculated across 4 dimensions: Transactions, DeFi, Security, and Social Proof.',
    target: '[data-tour="reputation-gauge"]'
  },
  {
    id: 'nft-badge',
    title: 'Soulbound NFT Badge',
    description: 'Your unique, non-transferable reputation NFT that visually represents your on-chain identity and achievements.',
    target: '[data-tour="nft-card"]'
  },
  {
    id: 'agent-visualization',
    title: 'Live Agent Coordination',
    description: 'Watch our 6 specialized ASI agents work together in real-time to analyze wallets and coordinate blockchain updates.',
    target: '[data-tour="agent-visualization"]',
    action: () => {
      // Trigger agent simulation
      const event = new CustomEvent('start-agent-demo');
      window.dispatchEvent(event);
    },
    requiredTab: 'agents'
  },
  {
    id: 'activity-timeline',
    title: 'Activity Timeline',
    description: 'Track all your reputation updates, NFT mints, and achievements in a beautiful chronological timeline.',
    target: '[data-tour="activity-timeline"]'
  },
  {
    id: 'chat-interface',
    title: 'Natural Language Chat',
    description: 'Ask questions about reputation, compare wallets, or get explanations - all through our ASI:One powered chat interface.',
    target: '[data-tour="chat-interface"]',
    requiredTab: 'chat'
  },
  {
    id: 'batch-analysis',
    title: 'Batch Analysis & Comparison',
    description: 'Analyze multiple wallets simultaneously or compare reputation scores side-by-side for comprehensive insights.',
    target: '[data-tour="batch-analysis"]',
    action: () => {
      const event = new CustomEvent('trigger-batch-demo');
      window.dispatchEvent(event);
    },
    requiredTab: 'analysis'
  },
  {
    id: 'metta-reasoning',
    title: 'MeTTa Symbolic Reasoning',
    description: 'Experience advanced AI reasoning that applies sophisticated rules to determine reputation levels and provide transparent explanations.',
    target: '[data-tour="metta-reasoning"]'
  },
  {
    id: 'blockchain-integration',
    title: 'Hedera Blockchain Integration',
    description: 'All reputation data is immutably stored on Hedera with 3-second finality, HCS audit trails, and HTS token support.',
    target: '[data-tour="blockchain-integration"]'
  },
  {
    id: 'demo-complete',
    title: 'Ready to Explore! 🎯',
    description: 'You\'ve seen all the features! Try connecting your wallet, chatting with ASI:One, or exploring the demo wallets to see Synthia in action.',
    target: 'body'
  }
];
