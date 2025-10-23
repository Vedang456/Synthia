# Synthia Agents - Multi-Agent Reputation System

## Overview

Synthia Agents is a sophisticated multi-agent system built on the **Fetch.ai uAgents framework** and **Hedera blockchain** that implements a decentralized reputation scoring system using **MeTTa symbolic reasoning**. The system consists of 4 specialized ASI (Artificial Superintelligence) agents that work together to analyze wallet addresses, compute reputation scores, and maintain on-chain reputation records.



## Architecture

### 🧠 Multi-Agent System Design

The system implements a **coordinated workflow** where each agent has specialized responsibilities:

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───▶│ Orchestrator │───▶│  Analyzer   │───▶│ Blockchain  │
│  Request    │    │  Agent       │    │  Agent      │    │  Agent      │
└─────────────┘    └──────────────┘    └─────────────┘    └─────────────┘
                                │
                                ▼
                       ┌─────────────┐
                       │  Chat       │
                       │  Agent      │
                       └─────────────┘
```

### 🤖 Agent Roles & Responsibilities

#### 1. **Orchestrator Agent** (`orchestrator.py`)
- **Role**: Central coordinator and request manager
- **Responsibilities**:
  - Receives and validates user requests for reputation analysis
  - Coordinates the analysis workflow between agents
  - Manages request lifecycle and state
  - Routes tasks to appropriate specialized agents
- **Contract Role**: `ORCHESTRATOR_ROLE`
- **Seed**: Configurable via environment variables

#### 2. **Wallet Analyzer Agent** (`wallet_analyzer.py`)
- **Role**: Deep wallet analysis and MeTTa reasoning engine
- **Responsibilities**:
  - Analyzes wallet transaction patterns and behavior
  - Applies **MeTTa symbolic reasoning** rules for reputation scoring
  - Computes multi-dimensional scores (transaction, DeFi, security, social)
  - Generates comprehensive analysis reports with reasoning explanations
  - Integrates with external APIs (Etherscan, etc.) for enhanced analysis
- **Contract Role**: `ANALYZER_ROLE`
- **EVM Address**: `0x3b4D391c2e1DE66CAeA6dEDa6A51E4a5180Bd3F7` (Testnet)
- **Private Key**: Generated during deployment (see Deployment.md)

#### 3. **Blockchain Agent** (`blockchain_agent.py`)
- **Role**: On-chain execution and Hedera integration specialist
- **Responsibilities**:
  - Executes smart contract interactions on Hedera
  - Updates reputation scores in Synthia smart contract
  - Manages NFT minting and tier updates
  - Logs analysis results to **Hedera Consensus Service (HCS)**
  - Handles **Agent-to-Agent (A2A)** and **Agent-to-Payment (AP2)** protocols
- **Contract Role**: `BLOCKCHAIN_ROLE`
- **EVM Address**: `0x509773c61012620fCBb8bED0BccAE44f1A93AD0C` (Testnet)
- **Private Key**: Generated during deployment (see Deployment.md)

#### 4. **ASI:One Chat Agent** (`asi_one_chat_agent.py`)
- **Role**: User interface and conversational AI
- **Responsibilities**:
  - Provides natural language interface for users
  - Handles chat-based reputation requests
  - Presents analysis results in user-friendly format
  - Manages conversational state and context
- **Contract Role**: `MARKETPLACE_ROLE` (for A2A requests)

## 🚀 Deployment Architecture

## Check the scripts folder for deployment scripts.
### Dual Blockchain Architecture

The system operates on **two blockchains simultaneously**:

#### **Fetch.ai (Primary - Agentverse)**
- **Network**: Dorado testnet (`dorado-1`)
- **Purpose**: Agent hosting and coordination
- **Features**:
  - Agentverse registration and discovery
  - Inter-agent communication via uAgents protocol
  - ASI Alliance compatibility
  - Decentralized agent marketplace

#### **Hedera (Secondary - Smart Contracts)**
- **Network**: Testnet (`296`)
- **Purpose**: Smart contract execution and data persistence
- **Services Used**:
  - **Hedera Smart Contracts**: Reputation scoring and NFT management
  - **Hedera Consensus Service (HCS)**: Audit trail and transparency
  - **Hedera Token Service (HTS)**: Reputation tokens (if needed)

### 📋 Deployed Contract Addresses (Testnet)

```
Synthia Contract: 0x88FF715f1c23C2061133994cFd58c1E35A05beA2
SynthiaNFT: 0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF
HCS Topic ID: 0.0.xxx (configured during deployment)
HTS Token ID: 0.0.xxx (configured during deployment)
```

## 🔄 Agent Workflow

### Complete Request Flow

1. **User Request Initiation**
   ```
   User → Chat Agent / Direct API
   ↓
   Orchestrator validates request
   ↓
   Creates request tracking
   ```

2. **Analysis Phase**
   ```
   Orchestrator → Wallet Analyzer
   ↓
   Analyzer performs deep wallet analysis
   ↓
   Applies MeTTa reasoning rules
   ↓
   Generates multi-dimensional scores
   ```

3. **Blockchain Execution**
   ```
   Orchestrator → Blockchain Agent
   ↓
   Agent calls Synthia smart contract
   ↓
   Updates reputation on-chain
   ↓
   Mints/updates NFT badge
   ```

4. **Result Delivery**
   ```
   Blockchain Agent → Orchestrator
   ↓
   Orchestrator → Chat Agent
   ↓
   Chat Agent → User (formatted response)
   ```

### Message Protocol

Agents communicate using structured message models:

```python
class ScoreRequest(Model):
    wallet_address: str
    request_id: str
    requester: Optional[str] = None

class ScoreAnalysis(Model):
    request_id: str
    wallet_address: str
    score: int
    analyzer_id: str
    transaction_score: int
    defi_score: int
    security_score: int
    social_score: int
    reputation_level: str
    reasoning_explanation: str
    metta_rules_applied: List[str]
    score_adjustments: int
    analysis_data: dict
    timestamp: int
```

## 🛠️ Setup Instructions

### Prerequisites

1. **Python Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Required Environment Variables

#### **Agentverse Configuration (Fetch.ai)**
```env
AGENTVERSE_API_KEY=your_agentverse_api_key
FET_PRIVATE_KEY=your_fetch_private_key
ALMANAC_URL=https://almanac.fetch.ai
REGISTER_AGENTS=true
```

#### **Agent Seeds & Addresses**
```env
ORCHESTRATOR_SEED=your_orchestrator_seed
BLOCKCHAIN_SEED=your_blockchain_seed
ANALYZER_SEED=your_analyzer_seed
ASI_ONE_SEED=your_chat_seed

ORCHESTRATOR_ADDRESS=fetch1_orchestrator_address
BLOCKCHAIN_ADDRESS=fetch1_blockchain_address
ANALYZER_ADDRESS=fetch1_analyzer_address
ASI_ONE_ADDRESS=fetch1_chat_address
```

#### **Hedera Configuration**
```env
HEDERA_RPC_URL=https://testnet.hashio.io/api
HEDERA_CHAIN_ID=296
HEDERA_ACCOUNT_ID=0.0.your_account_id
HEDERA_PRIVATE_KEY=0x_your_private_key

SYNTHIA_CONTRACT_ADDRESS=0x88FF715f1c23C2061133994cFd58c1E35A05beA2
SYNTHIA_NFT_ADDRESS=0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF
```

#### **Agent EVM Keys (from deployment)**
```env
ANALYZER_EVM_PRIVATE_KEY=0x96....c8  # From register_agents.ts
BLOCKCHAIN_EVM_PRIVATE_KEY=0x3....9e  # From register_agents.ts
```

### Smart Contract Setup

1. **Deploy Contracts** (from project root):
   ```bash
   cd /path/to/Synthia
   npm install
   npx hardhat run scripts/deploy.ts --network testnet
   ```

2. **Configure Hedera Services**:
   ```bash
   npx hardhat run scripts/configure-heders.ts --network testnet
   ```

3. **Register Agent EVM Addresses**:
   ```bash
   npx hardhat run scripts/register_agents.ts --network testnet
   ```

### Agent Deployment

1. **Configure Agentverse**:
   - Register on [Agentverse](https://agentverse.ai)
   - Get API key and FET private key
   - Add to `.env` file

2. **Start Agents**:
   ```bash
   # Terminal 1: Orchestrator
   python agents/orchestrator.py

   # Terminal 2: Wallet Analyzer
   python agents/wallet_analyzer.py

   # Terminal 3: Blockchain Agent
   python agents/blockchain_agent.py

   # Terminal 4: Chat Agent
   python agents/asi_one_chat_agent.py
   ```

3. **Register on Agentverse** (optional):
   ```bash
   # Each agent will auto-register if REGISTER_AGENTS=true
   # Or register manually via Agentverse dashboard
   ```

## 🔧 Configuration Details

### MeTTa Reasoning Integration

The Wallet Analyzer implements **MeTTa symbolic reasoning**:

```python
# Example MeTTa rules applied:
metta_rules_applied = [
    "elite_defi_user,excellent_reputation",
    "high_volume_trader,trusted_member",
    "security_conscious,high_reputation",
    "social_validator,excellent_reputation"
]
```

### Reputation Scoring System

**Score Components**:
- **Transaction Score** (0-300): Based on transaction patterns
- **DeFi Score** (0-250): DeFi protocol interactions
- **Security Score** (0-200): Security practices and history
- **Social Score** (0-250): Community engagement and validation

**Reputation Tiers**:
- **Diamond** (900+): Elite reputation
- **Platinum** (800+): Excellent reputation
- **Gold** (700+): High reputation
- **Silver** (600+): Trusted member
- **Bronze** (400+): Basic reputation

## 🧪 Testing

### Local Testing
```bash
# Test agent communication
python -m pytest tests/test_agent_communication.py

# Test smart contract integration
cd /path/to/Synthia
npx hardhat test tests/synthia.test.js
```

### Integration Testing
1. Deploy contracts to local Hardhat network
2. Start agents with local configuration
3. Run end-to-end tests

## 📊 Monitoring & Logging

### Agent Health Monitoring
- Each agent exposes health endpoints
- Integration with Agentverse monitoring
- Log aggregation for debugging

### On-Chain Analytics
- **HashScan**: Monitor contract interactions
- **HCS Audit Trail**: View analysis logs
- **NFT Metadata**: Track reputation changes

## 🔐 Security Considerations

1. **Private Key Management**:
   - Store EVM private keys securely
   - Use hardware wallets for production
   - Implement key rotation policies

2. **Access Control**:
   - Role-based permissions on smart contracts
   - Agent authentication via cryptographic seeds
   - Request validation and rate limiting

3. **Data Privacy**:
   - On-chain data is public by design
   - Off-chain analysis data is encrypted
   - GDPR compliance for user data handling

## 🤝 Contributing

1. **Agent Development**:
   - Follow uAgents framework best practices
   - Implement comprehensive error handling
   - Add unit tests for new functionality

2. **Smart Contract Updates**:
   - Maintain compatibility with existing agents
   - Update deployment scripts accordingly
   - Test on multiple networks

## 📚 Additional Resources

- [uAgents Documentation](https://docs.fetch.ai/uagents/)
- [Hedera Developer Portal](https://docs.hedera.com/)
- [Agentverse Platform](https://agentverse.ai/)
- [MeTTa Language Documentation](https://github.com/meta-language/metta)
- [ASI Alliance](https://asi-alliance.io/)

## 🏗️ Project Structure

```
synthia-agents/
├── agents/
│   ├── orchestrator.py          # Central coordinator
│   ├── wallet_analyzer.py       # MeTTa reasoning engine
│   ├── blockchain_agent.py      # Hedera integration
│   └── asi_one_chat_agent.py    # User interface
├── tests/
│   └── (test files)
├── scripts/
│   └── (deployment scripts)
├── .env.example                 # Environment template
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

---

**Built for ETHOnline 2025 - ASI Alliance & Hedera Tracks** 🚀
