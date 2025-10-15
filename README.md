# Synthia - AI-Powered Web3 Reputation System

[![ETHOnline 2025](https://img.shields.io/badge/ETHOnline-2025-purple?style=for-the-badge)](https://ethonline.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Blockchain-blue?style=for-the-badge)](https://hedera.com/)
[![ASI Alliance](https://img.shields.io/badge/ASI%20Alliance-Fetch.ai-orange?style=for-the-badge)](https://fetch.ai/)

> **Synthia** - Where AI meets blockchain to create transparent, trustworthy reputation in Web3. Powered by ASI Alliance agents, MeTTa symbolic reasoning, and Hedera's enterprise-grade blockchain infrastructure.

## 🌟 Overview

Synthia is a revolutionary **multi-agent AI system** that provides comprehensive reputation analysis for Web3 wallets. By combining cutting-edge AI technologies from the ASI Alliance with Hedera's lightning-fast, low-cost blockchain, Synthia delivers transparent, tamper-proof reputation scores that unlock the true potential of decentralized identity.

### 🎯 Key Features

- **🤖 Multi-Agent AI Architecture** - 5 specialized ASI agents working in harmony
- **🧠 MeTTa Symbolic Reasoning** - Explainable AI with formal logic rules
- **⛓️ Hedera Integration** - 3-second finality, $0.0001 transactions
- **🎨 Soulbound NFTs** - Non-transferable reputation badges with dynamic SVG generation
- **💬 Natural Language Interface** - Conversational AI for user interaction
- **📊 Real-time Analytics** - Live agent coordination visualization
- **🔒 Security-First Design** - Comprehensive risk assessment and fraud detection

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ASI:One Chat  │───▶│  Orchestrator   │───▶│ Wallet Analyzer │
│   Agent         │    │   Agent         │    │   Agent         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ MeTTa Reasoning │
                       │   Engine        │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Blockchain      │
                       │   Agent         │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Smart Contracts │
                       │  + Soulbound    │
                       │     NFTs        │
                       └─────────────────┘
```

## 🛠️ Technology Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom cyberpunk theme
- **Framer Motion** for smooth animations
- **Radix UI** for accessible components
- **Reown AppKit** for wallet connections

### **AI & Agents**
- **ASI Alliance (Fetch.ai)** - Multi-agent framework
- **uAgents** - Inter-agent communication protocol
- **MeTTa (SingularityNET)** - Symbolic reasoning engine
- **Python** - Agent implementation language

### **Blockchain**
- **Hedera Hashgraph** - Enterprise blockchain platform
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - Security and access control
- **Hardhat** - Development and deployment framework

### **Backend Services**
- **Web3.py** - Python blockchain integration
- **WebSockets** - Real-time agent communication
- **Redis** - Session management and caching

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Python 3.8+** and pip
- **Hedera testnet account** (get free HBAR from [faucet](https://portal.hedera.com/faucet))
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/synthia.git
cd synthia

# Install frontend dependencies
cd frontend
npm install

# Install agent dependencies
cd ../synthia-agents
pip install -r requirements.txt

# Return to root directory
cd ..
```

### Development Setup

```bash
# Terminal 1: Start frontend development server
cd frontend
npm run dev

# Terminal 2: Start agent system (demo mode)
cd synthia-agents
python3 run_demo_agents.py

# Terminal 3: Deploy contracts to testnet (optional)
npx hardhat run scripts/deploy.ts --network hedera_testnet
```

**Access the application:**
- Frontend: http://localhost:5173
- Agent Dashboard: http://localhost:8000 (Orchestrator)

## 🤖 Agent System

Synthia employs a **sophisticated multi-agent architecture** with 5 specialized agents:

### **1. 🎭 ASI:One Chat Agent**
- **Natural language processing** for user queries
- **Intent recognition** and conversation management
- **Multi-wallet comparison** capabilities
- **Contextual response generation**

### **2. 🎼 Orchestrator Agent**
- **Request lifecycle management** with unique tracking IDs
- **Agent coordination** and load balancing
- **Error handling** and timeout management
- **Performance monitoring** and health checks

### **3. 🔍 Wallet Analyzer Agent**
- **Multi-dimensional analysis**:
  - Transaction patterns and volume
  - DeFi protocol participation
  - Security posture assessment
  - Social proof verification
- **Risk scoring** and fraud detection
- **Real-time blockchain data fetching**

### **4. 🧠 MeTTa Reasoning Engine**
- **10 sophisticated reasoning rules**:
  - Elite DeFi User detection
  - Security risk assessment
  - Social proof verification
  - Emerging user identification
  - Long-term wallet bonuses
- **Explainable AI decisions** with transparent logic
- **Priority-based rule application**

### **5. ⛓️ Blockchain Agent**
- **Smart contract interactions** for score updates
- **NFT minting** with dynamic SVG generation
- **HCS audit logging** for immutable records
- **Hedera service integration** (HCS + HTS)

## 📋 Smart Contracts

### **Synthia.sol** - Main Reputation Contract

**Core Features:**
- **Role-based access control** for agent authorization
- **Request management** with pending/completed states
- **Score storage** with version tracking and audit trails
- **Batch processing** for efficient multi-user updates
- **Achievement system** for milestone unlocks

**Key Functions:**
```solidity
// User-initiated analysis requests
function requestScoreUpdate() external

// Agent-to-agent marketplace requests
function requestAnalysisViaA2A(address user, uint256 maxPriceHBAR) external

// Score updates with MeTTa reasoning
function updateScore(address user, uint256 score, bytes32 mettaRulesHash, int256 scoreAdjustment) external

// Batch score updates for efficiency
function batchUpdateScores(address[] calldata users, uint256[] calldata scores, bytes32[] calldata mettaRulesHashes) external
```

### **SynthiaNFT.sol** - Soulbound NFT Contract

**Features:**
- **Non-transferable tokens** (true soulbound implementation)
- **Dynamic SVG generation** based on reputation tiers
- **Tier-based visual design**:
  - Diamond (900+): Cyan gradient with premium effects
  - Platinum (800+): Silver aesthetic
  - Gold (700+): Golden styling
  - Silver (600+): Classic silver design
  - Bronze (400+): Bronze theme

## 🎨 User Interface

### **Dashboard Features**
- **Real-time reputation scores** with tier indicators
- **Interactive agent visualization** showing live coordination
- **Dynamic NFT badges** with hover effects and animations
- **Comprehensive analytics** with breakdown by category
- **Natural language chat** with ASI:One agent

### **Demo Mode**
- **Offline functionality** for presentations and testing
- **Simulated agent workflows** for demonstration
- **Sample wallet data** across different tiers
- **Interactive tutorials** with guided tours

## 🔧 API Documentation

### **Agent Communication Protocol**

**Message Types:**
```typescript
// Score analysis requests
interface ScoreRequest {
  wallet_address: string;
  request_id: string;
  requester?: string;
}

// Analysis results with MeTTa reasoning
interface ScoreAnalysis {
  request_id: string;
  wallet_address: string;
  score: number;
  transaction_score: number;
  defi_score: number;
  security_score: number;
  social_score: number;
  reputation_level: string;
  reasoning_explanation: string;
  metta_rules_applied: string[];
  score_adjustments: number;
}
```

### **Frontend Integration**

**Wallet Connection:**
```typescript
// Using Reown AppKit for multi-chain support
import { createAppKit } from '@reown/appkit'

// Configuration for Hedera testnet + Ethereum
const appKit = createAppKit({
  adapters: [ethersAdapter],
  networks: [hederaTestnet, ethereum],
  projectId: 'your-project-id'
})
```

## 🚢 Deployment

### **Testnet Deployment (Recommended for Demo)**

```bash
# 1. Deploy contracts to Hedera testnet
npx hardhat run scripts/deploy.ts --network hedera_testnet

# 2. Fund testnet accounts
# Visit: https://portal.hedera.com/faucet

# 3. Configure agent environment
cp .env.example .env.production
# Edit with testnet addresses and credentials

# 4. Deploy agents
python3 deploy_agents.py --testnet --production

# 5. Build frontend
npm run build

# 6. Deploy to hosting service
npm run deploy
```

### **Environment Variables**

```bash
# Agent Configuration
ORCHESTRATOR_SEED=secure_production_seed
WALLET_ANALYZER_SEED=secure_production_seed
BLOCKCHAIN_SEED=secure_production_seed
ASI_ONE_SEED=secure_production_seed

# Hedera Configuration
HEDERA_ACCOUNT_ID=0.0.xxxx
HEDERA_PRIVATE_KEY=302e...
HEDERA_NETWORK=testnet

# Contract Addresses
SYNTHIA_CONTRACT_ADDRESS=0x...
SYNTHIA_NFT_CONTRACT_ADDRESS=0x...

# API Configuration
API_BASE_URL=https://api.synthia.app
WS_BASE_URL=wss://api.synthia.app
```

## 📊 Performance & Scalability

### **Agent Performance**
- **Sub-second response times** for analysis requests
- **Parallel processing** for multiple wallet analyses
- **Efficient state management** with Redis caching
- **Horizontal scaling** support for increased load

### **Blockchain Efficiency**
- **Batch processing** for multiple score updates
- **Gas optimization** with efficient contract design
- **3-second finality** on Hedera network
- **Minimal transaction costs** (~$0.0001 per operation)

## 🔒 Security & Compliance

### **Security Measures**
- **End-to-end encryption** for agent communication
- **Input validation** and sanitization
- **Rate limiting** on API endpoints
- **Access control** with role-based permissions

### **Compliance Features**
- **GDPR compliance** for user data handling
- **Audit trails** for all transactions
- **Transparent AI decisions** with MeTTa reasoning
- **Immutable records** on Hedera blockchain

## 🤝 Contributing

### **Development Setup**
```bash
# Fork and clone the repository
git clone https://github.com/your-username/synthia.git
cd synthia

# Install dependencies
npm install
pip install -r requirements.txt

# Start development servers
npm run dev          # Frontend
python3 run_dev.py   # Agents (development mode)
```

### **Code Structure**
```
synthia/
├── contracts/           # Smart contracts
│   ├── Synthia.sol     # Main reputation contract
│   └── SynthiaNFT.sol  # Soulbound NFT contract
├── frontend/           # React application
│   ├── src/components/ # UI components
│   ├── src/hooks/      # Custom hooks
│   └── src/lib/        # Utilities
├── synthia-agents/     # Python agent system
│   ├── agents/         # Individual agent implementations
│   └── protocols/      # Communication protocols
└── scripts/           # Deployment scripts
```

### **Testing**
```bash
# Run contract tests
npx hardhat test

# Run agent integration tests
python3 test_agent_integration.py

# Run frontend tests
npm run test
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ETHOnline 2025** for the incredible hackathon experience
- **ASI Alliance** for the revolutionary multi-agent framework
- **Hedera** for enterprise-grade blockchain infrastructure
- **SingularityNET** for MeTTa symbolic reasoning capabilities
- **Fetch.ai** for uAgents communication protocol

## 📞 Support

For support, feature requests, or bug reports:
- **GitHub Issues**: [Create an issue](https://github.com/your-username/synthia/issues)
- **Discussions**: [Join the conversation](https://github.com/your-username/synthia/discussions)
- **Email**: support@synthia.app

---

**Built with ❤️ for the future of decentralized reputation in Web3**
