export interface DemoStep {
  id: string;
  title: string;
  description: string;
  target: string;
  action?: () => void;
  highlight?: string[];
  requiredTab?: 'overview' | 'agents' | 'analysis';
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Synthia! 🚀',
    description: 'Experience the future of decentralized reputation powered by ASI Alliance agents, MeTTa reasoning, and Hedera blockchain. This demo shows how real users interact with the system.',
    target: 'body'
  },
  {
    id: 'reputation-dashboard',
    title: 'Reputation Dashboard',
    description: 'Your comprehensive reputation overview showing scores across 4 dimensions: Transactions, DeFi Activity, Security, and Social Proof. Real users see their actual wallet data here.',
    target: '[data-tour="reputation-gauge"]'
  },
  {
    id: 'live-analysis',
    title: 'Live Agent Analysis',
    description: 'Watch our ASI agents work in real-time. When you request a score update, agents analyze your wallet, apply MeTTa reasoning rules, and update your reputation on the blockchain.',
    target: '[data-tour="agent-visualization"]',
    action: () => {
      // Trigger agent simulation
      const event = new CustomEvent('start-agent-demo');
      window.dispatchEvent(event);
    }
  },
  {
    id: 'real-transactions',
    title: 'Real MetaMask Transactions',
    description: 'Experience actual blockchain transactions! Connect your wallet and click "Request Score Update" to see real MetaMask popups and blockchain interactions, just like live users.',
    target: '[data-tour="score-update-button"]'
  },
  {
    id: 'nft-generation',
    title: 'Dynamic NFT Badges',
    description: 'Your reputation is minted as a unique soulbound NFT with dynamic SVG graphics that reflect your current tier and achievements. Real users receive these automatically.',
    target: '[data-tour="nft-card"]'
  },
  {
    id: 'ai-chat',
    title: 'AI-Powered Chat',
    description: 'Ask questions about your reputation, compare wallets, or get explanations using natural language. The ASI:One chat agent provides intelligent responses based on your actual data.',
    target: '[data-tour="ai-chat-button"]'
  },
  {
    id: 'blockchain-integration',
    title: 'Hedera Blockchain Integration',
    description: 'All reputation data is stored on Hedera with 3-second finality. Real transactions use HCS for audit trails and HTS for token management, ensuring transparency and security.',
    target: '[data-tour="blockchain-integration"]'
  },
  {
    id: 'demo-complete',
    title: 'Ready to Use Synthia! 🎯',
    description: 'You\'ve experienced the complete Synthia workflow! Connect your real wallet to see your actual reputation scores, request real blockchain updates, and interact with the full system.',
    target: 'body'
  }
];
