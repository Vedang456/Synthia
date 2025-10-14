// Contract addresses on Hedera testnet
export const CONTRACTS = {
  SYNTHIA: import.meta.env.VITE_SYNTHIA_CONTRACT_ADDRESS || "",
  SYNTHIA_NFT: import.meta.env.VITE_SYNTHIA_NFT_CONTRACT_ADDRESS || "",
};

// Hedera testnet configuration
export const HEDERA_TESTNET = {
  chainId: 296,
  name: "Hedera Testnet",
  currency: "HBAR",
  explorerUrl: "https://hashscan.io/testnet",
  rpcUrl: "https://testnet.hashio.io/api",
};

// Synthia contract ABI
export const SYNTHIA_ABI = [
  "function requestScoreUpdate() external",
  "function updateScore(address user, uint256 score) external",
  "function getUserScore(address user) external view returns (uint256 score, uint256 lastUpdated)",
  "function updateASIAgent(address _newAgent) external",
  "function asiAgent() external view returns (address)",
  "function pendingUpdates(address) external view returns (bool)",
  "function synthiaNFT() external view returns (address)",
  "event ScoreRequested(address indexed user, uint256 timestamp)",
  "event ScoreUpdated(address indexed user, uint256 score, uint256 timestamp)",
  "event ASIAgentUpdated(address indexed oldAgent, address indexed newAgent)",
] as const;

// SynthiaNFT contract ABI
export const SYNTHIA_NFT_ABI = [
  "function updateReputation(address user, uint256 score) external returns (uint256)",
  "function getReputationData(uint256 tokenId) external view returns (uint256 score, uint256 lastUpdated)",
  "function getTokenId(address user) external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function synthiaContract() external view returns (address)",
  "event ReputationUpdated(address indexed user, uint256 indexed tokenId, uint256 score, uint256 timestamp)",
] as const;
