# 🔗 Smart Contract Deployments

## 📋 Live Contract Addresses (Hedera Testnet)

- **Synthia Main Contract**: https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2
- **SynthiaNFT Contract**: https://hashscan.io/testnet/contract/0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF

---

# 🤖 Synthia Smart Contracts

## Overview

The Synthia smart contract system consists of two main contracts that work together to provide a **decentralized, AI-powered reputation scoring system** on the **Hedera blockchain**. These contracts implement a sophisticated multi-agent reputation analysis platform that combines MeTTa symbolic reasoning with on-chain transparency.

## 🏗️ Contract Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  SYNTHIA MAIN CONTRACT                   │
│              (Multi-Agent Coordination)                  │
└─────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────┐
│                 SYNTHIA NFT CONTRACT                     │
│             (Soulbound Reputation Badges)                │
└─────────────────────────────────────────────────────────┘
```

## 📋 Contracts Overview

### 1. **Synthia.sol** - Main Reputation Contract

**Contract Address**: `0x88FF715f1c23C2061133994cFd58c1E35A05beA2`  
**Purpose**: Central coordination hub for multi-agent reputation analysis

#### 🎯 Core Functionality

**Multi-Agent System Integration**
- **Role-based Access Control**: 4 distinct agent roles with specific permissions
- **Agent Registration**: Orchestrator can register specialized analysis agents
- **Request Management**: Handles user-initiated and A2A (Agent-to-Agent) requests

**Reputation Scoring Engine**
- **Score Updates**: Agents submit scores with MeTTa reasoning explanations
- **Version Control**: Tracks score evolution with timestamp and analyzer information
- **Batch Processing**: Efficient multi-user score updates (gas optimization)
- **Achievement System**: Automatic milestone unlocks based on score thresholds

**Hedera Integration**
- **HCS (Hedera Consensus Service)**: Immutable audit trail for all analyses
- **HTS (Hedera Token Service)**: Integration with reputation tokens
- **A2A/AP2 Protocols**: Agent-to-agent and agent-to-payment coordination

#### 🔑 Key Functions

```solidity
// User Request Management
function requestScoreUpdate() external
function requestAnalysisViaA2A(address user, uint256 maxPriceHBAR) external

// Score Management
function updateScore(address user, uint256 score, bytes32 mettaRulesHash, int256 scoreAdjustment) external
function batchUpdateScores(address[] calldata users, uint256[] calldata scores, bytes32[] calldata mettaRulesHashes) external

// Agent Management
function registerAgent(address agent, bytes32 role) external
function setHCSAuditTopic(bytes32 topicId) external

// Data Retrieval
function getUserReputation(address user) external view returns (uint256, uint256, address, bytes32, uint256, uint256)
function getStatistics() external view returns (uint256, uint256, uint256)
```

#### 🛡️ Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **AccessControl**: Role-based permissions (OpenZeppelin)
- **Input Validation**: Comprehensive parameter validation
- **Non-Reentrant Updates**: Atomic score update operations

### 2. **SynthiaNFT.sol** - Soulbound Reputation NFT

**Contract Address**: `0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF`  
**Purpose**: Dynamic, non-transferable reputation visualization

#### 🎨 Core Functionality

**Soulbound NFT System**
- **Non-Transferable**: True soulbound implementation - tokens cannot be transferred
- **Dynamic Updates**: Reputation badges update automatically with score changes
- **Tier-Based Design**: Visual representation of reputation levels

**On-Chain SVG Generation**
- **Dynamic Metadata**: Real-time SVG generation based on reputation scores
- **Tier Visualization**: Color-coded badges (Diamond, Platinum, Gold, Silver, Bronze)
- **Base64 Encoding**: Complete on-chain metadata storage

**Reputation Tier System**
```
Diamond   (900-1000): Premium cyan gradient with effects
Platinum  (800-899):  Elegant silver styling
Gold      (700-799):  Golden aesthetic
Silver    (600-699):  Classic silver design
Bronze    (400-599):  Bronze theme
Unranked  (0-399):    Standard gray
```

#### 🔑 Key Functions

```solidity
// Reputation Updates
function updateReputation(address user, uint256 score) external returns (uint256)

// Data Retrieval
function getReputationData(uint256 tokenId) external view returns (uint256, uint256)
function getFullReputationData(uint256 tokenId) external view returns (uint256, uint256, uint256, uint256, string memory)
function getTokenId(address user) external view returns (uint256)

// NFT Standards
function tokenURI(uint256 tokenId) public view override returns (string memory)
```

#### 🎭 NFT Features

**Visual Design Elements**
- **Background**: Gradient from dark blue to lighter blue
- **Border**: Animated tier-colored border with opacity effects
- **Typography**: Large score display with tier name
- **Branding**: "Powered by ASI Alliance" and "Verified on Hedera"
- **Token ID**: Displayed for uniqueness verification

**Metadata Structure**
```json
{
  "name": "Synthia Reputation #12345",
  "description": "Soulbound reputation NFT powered by ASI Alliance agents...",
  "image": "data:image/svg+xml;base64,...",
  "attributes": [
    {"trait_type": "Score", "value": 875},
    {"trait_type": "Tier", "value": "Platinum"},
    {"trait_type": "Total Updates", "value": 5},
    {"trait_type": "Last Updated", "display_type": "date", "value": 1697123456}
  ]
}
```

## 🔄 Integration Flow

### Complete System Workflow

1. **User Request** → User calls `requestScoreUpdate()`
2. **Agent Analysis** → Wallet Analyzer processes transaction data
3. **MeTTa Reasoning** → Symbolic reasoning rules applied
4. **Score Submission** → Blockchain Agent calls `updateScore()`
5. **NFT Update** → Reputation NFT automatically updates
6. **Audit Logging** → HCS records the analysis for transparency

### Agent Role Mapping

| Agent | Contract Role | EVM Address | Purpose |
|-------|---------------|-------------|---------|
| **Orchestrator** | `ORCHESTRATOR_ROLE` | - | Coordinates system |
| **Wallet Analyzer** | `ANALYZER_ROLE` | `0x3b4D391c2e1DE66CAeA6dEDa6A51E4a5180Bd3F7` | Submits scores |
| **Blockchain Agent** | `BLOCKCHAIN_ROLE` | `0x509773c61012620fCBb8bED0BccAE44f1A93AD0C` | HCS logging |
| **Chat Agent** | `MARKETPLACE_ROLE` | - | A2A requests |

## 🚀 Deployment & Configuration

### Environment Setup

```bash
# Required environment variables
HEDERA_ACCOUNT_ID=0.0.your_account
HEDERA_PRIVATE_KEY=0x_your_private_key
HEDERA_RPC_URL=https://testnet.hashio.io/api

# Contract addresses (after deployment)
SYNTHIA_CONTRACT_ADDRESS=0x88FF715f1c23C2061133994cFd58c1E35A05beA2
SYNTHIA_NFT_ADDRESS=0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF
```

### Hedera Services Configuration

**HCS Topic**: `0.0.xxx` (for audit trails)  
**HTS Token**: `0.0.xxx` (for reputation rewards)

## 🧪 Testing

### Comprehensive Test Suite

The contracts include extensive testing covering:

- ✅ **Multi-agent authorization** and role validation
- ✅ **Score update workflows** with MeTTa reasoning
- ✅ **Batch processing** for gas optimization
- ✅ **NFT generation** and tier transitions
- ✅ **Soulbound properties** (non-transferable)
- ✅ **Achievement system** and milestone unlocks
- ✅ **HCS integration** for audit trails
- ✅ **A2A/AP2 protocols** for agent coordination
- ✅ **Gas optimization** for Hedera efficiency

### Running Tests

```bash
# Compile contracts
npx hardhat compile

# Run full test suite
npx hardhat test

# Run specific tests
npx hardhat test --grep "Multi-Agent System"
npx hardhat test --grep "NFT Enhancements"
```

## 📊 Performance Characteristics

### Gas Optimization
- **Score Updates**: ~200,000 gas (Hedera optimized)
- **Batch Updates**: ~150,000 gas per user (50-user batches)
- **NFT Updates**: ~300,000 gas (including SVG generation)

### Throughput
- **Analysis Requests**: 10-15 seconds end-to-end
- **Batch Processing**: Up to 50 users per transaction
- **Finality**: 3-second confirmation on Hedera

## 🔐 Security Features

### Access Control
- **Role-based Permissions**: Only authorized agents can update scores
- **Request Validation**: Prevents duplicate or malicious requests
- **Time-based Cooldowns**: 1-day cooldown between requests per user

### Data Integrity
- **Version Tracking**: Complete audit trail of score changes
- **Immutable Records**: HCS logging for tamper-proof history
- **Input Sanitization**: Comprehensive validation of all parameters

## 🎯 Real-World Applications

### DeFi Integration
- **Undercollateralized Lending**: Use reputation scores for credit assessment
- **Protocol Access**: Tier-based access to premium DeFi features
- **Risk Management**: Automated risk scoring for lending protocols

### Identity & Reputation
- **Portable Reputation**: Cross-platform reputation verification
- **Achievement System**: Gamification of on-chain behavior
- **Social Proof**: Community-based reputation validation

---

## 📚 Additional Resources

- **Main Documentation**: See `../README.md` for complete system overview
- **Agent Documentation**: See `../synthia-agents/README.md` for agent details
- **Deployment Guide**: See `../synthia-agents/Deployment.md` for setup instructions
- **Test Suite**: See `../tests/synthia.test.js` for comprehensive testing

---

**Built for ETHOnline 2025 - ASI Alliance & Hedera Tracks** 🚀
