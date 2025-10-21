// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SynthiaNFT.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Synthia
 * @dev Main contract integrating ASI agents, MeTTa reasoning, and Hedera services
 * Designed for ETHOnline 2025 - ASI Alliance & Hedera tracks
 */
contract Synthia is ReentrancyGuard, AccessControl {
    // Roles for multi-agent system
    bytes32 public constant ORCHESTRATOR_ROLE = keccak256("ORCHESTRATOR_ROLE");
    bytes32 public constant ANALYZER_ROLE = keccak256("ANALYZER_ROLE");
    bytes32 public constant BLOCKCHAIN_ROLE = keccak256("BLOCKCHAIN_ROLE");
    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");
    
    // The SynthiaNFT contract
    SynthiaNFT public immutable synthiaNFT;
    
    // HCS Topic ID for audit trail (stored as bytes32)
    bytes32 public hcsAuditTopicId;
    
    // HTS Token ID for reputation tokens (if different from NFT)
    address public htsReputationToken;
    
    struct AnalysisRequest {
        address user;
        uint256 requestTimestamp;
        address requestingAgent; // For A2A marketplace
        uint256 maxPriceHBAR; // For AP2 payments
        bool isPaid;
        bool isCompleted;
    }
    
    struct ReputationScore {
        uint256 score; // 0-1000
        uint256 timestamp;
        address analyzedBy; // Which agent performed analysis
        bytes32 mettaRulesApplied; // Hash of MeTTa rules applied
        uint256 version; // Increments on each update
    }
    
    // Mappings
    mapping(address => AnalysisRequest) public pendingRequests;
    mapping(address => ReputationScore) public userScores;
    mapping(bytes32 => bool) public processedRequests; // Prevent duplicate processing
    
    // Counters
    uint256 public totalAnalysesCompleted;
    uint256 public totalAgentsRegistered;
    
    // Events for ASI agent coordination
    event ScoreRequested(
        address indexed user, 
        uint256 timestamp,
        bytes32 requestId
    );
    
    event ScoreUpdated(
        address indexed user, 
        uint256 score, 
        uint256 timestamp,
        address indexed analyzer,
        bytes32 mettaRulesHash
    );
    
    event AgentRegistered(
        address indexed agent,
        bytes32 role,
        uint256 timestamp
    );
    
    event MettaReasoningApplied(
        address indexed user,
        bytes32 rulesHash,
        uint256 scoreAdjustment,
        uint256 timestamp
    );
    
    event HCSAuditLogged(
        address indexed user,
        bytes32 hcsMessageId,
        uint256 timestamp
    );
    
    event A2ARequestReceived(
        address indexed requester,
        address indexed user,
        uint256 maxPriceHBAR,
        bytes32 requestId
    );
    
    event AP2PaymentReceived(
        address indexed payer,
        uint256 amountHBAR,
        bytes32 invoiceId
    );
    
    event BatchScoresUpdated(
        address[] users,
        uint256[] scores,
        uint256 timestamp
    );
    
    event AchievementUnlocked(
        address indexed user, 
        string achievement, 
        uint256 score,
        uint256 timestamp
    );
    
    /**
     * @dev Constructor - deploys NFT and sets up multi-agent access control
     * @param _orchestratorAgent Address of orchestrator agent
     */
    constructor(address _orchestratorAgent) {
        require(_orchestratorAgent != address(0), "Invalid orchestrator");
        
        // Deploy SynthiaNFT
        SynthiaNFT nft = new SynthiaNFT();
        synthiaNFT = nft;
        nft.setSynthiaContract(address(this));
        
        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORCHESTRATOR_ROLE, _orchestratorAgent);
        
        emit AgentRegistered(_orchestratorAgent, ORCHESTRATOR_ROLE, block.timestamp);
        totalAgentsRegistered = 1;
    }
    
    /**
     * @dev Register a new agent (orchestrator can register other agents)
     * @param agent Address of the agent
     * @param role Role to grant
     */
    function registerAgent(address agent, bytes32 role) external onlyRole(ORCHESTRATOR_ROLE) {
        require(agent != address(0), "Invalid agent address");
        require(
            role == ANALYZER_ROLE || 
            role == BLOCKCHAIN_ROLE || 
            role == MARKETPLACE_ROLE,
            "Invalid role"
        );
        
        _grantRole(role, agent);
        totalAgentsRegistered++;
        
        emit AgentRegistered(agent, role, block.timestamp);
    }
    
    /**
     * @dev Set HCS topic ID for audit trail
     * @param topicId The Hedera Consensus Service topic ID
     */
    function setHCSAuditTopic(bytes32 topicId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(topicId != bytes32(0), "Invalid topic ID");
        hcsAuditTopicId = topicId;
    }
    
    /**
     * @dev Set HTS token address for reputation tokens
     * @param tokenAddress The Hedera Token Service token address
     */
    function setHTSReputationToken(address tokenAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokenAddress != address(0), "Invalid token address");
        htsReputationToken = tokenAddress;
    }
    
    /**
     * @dev User requests reputation analysis
     */
    function requestScoreUpdate() external {
        address user = msg.sender;
        require(!pendingRequests[user].isCompleted || 
                block.timestamp > pendingRequests[user].requestTimestamp + 1 days,
                "Recent request pending");
        
        bytes32 requestId = keccak256(abi.encodePacked(user, block.timestamp, block.number));
        
        pendingRequests[user] = AnalysisRequest({
            user: user,
            requestTimestamp: block.timestamp,
            requestingAgent: address(0),
            maxPriceHBAR: 0,
            isPaid: true, // Free for direct user requests
            isCompleted: false
        });
        
        emit ScoreRequested(user, block.timestamp, requestId);
    }
    
    /**
     * @dev A2A: External agent requests analysis (for marketplace)
     * @param user User to analyze
     * @param maxPriceHBAR Maximum price willing to pay
     */
    function requestAnalysisViaA2A(
        address user,
        uint256 maxPriceHBAR
    ) external onlyRole(MARKETPLACE_ROLE) returns (bytes32) {
        bytes32 requestId = keccak256(
            abi.encodePacked(user, msg.sender, block.timestamp, block.number)
        );
        
        require(!processedRequests[requestId], "Request already exists");
        processedRequests[requestId] = true;
        
        pendingRequests[user] = AnalysisRequest({
            user: user,
            requestTimestamp: block.timestamp,
            requestingAgent: msg.sender,
            maxPriceHBAR: maxPriceHBAR,
            isPaid: false,
            isCompleted: false
        });
        
        emit A2ARequestReceived(msg.sender, user, maxPriceHBAR, requestId);
        return requestId;
    }
    
    /**
     * @dev AP2: Confirm payment received (called by marketplace agent)
     * @param invoiceId The AP2 invoice ID
     */
    function confirmAP2Payment(
        bytes32 invoiceId,
        uint256 amountHBAR
    ) external onlyRole(MARKETPLACE_ROLE) {
        // In production, would verify Hedera transaction
        emit AP2PaymentReceived(msg.sender, amountHBAR, invoiceId);
    }
    
    /**
     * @dev Analyzer agent updates score with MeTTa reasoning
     * @param user User address
     * @param score Reputation score (0-1000)
     * @param mettaRulesHash Hash of MeTTa rules applied
     * @param scoreAdjustment Score adjustment from MeTTa reasoning
     */
    function updateScore(
        address user,
        uint256 score,
        bytes32 mettaRulesHash,
        int256 scoreAdjustment
    ) external nonReentrant onlyRole(ANALYZER_ROLE) {
        require(score <= 1000, "Invalid score");
        
        // Update score
        uint256 currentVersion = userScores[user].version;
        userScores[user] = ReputationScore({
            score: score,
            timestamp: block.timestamp,
            analyzedBy: msg.sender,
            mettaRulesApplied: mettaRulesHash,
            version: currentVersion + 1
        });
        
        // Update NFT
        synthiaNFT.updateReputation(user, score);
        
        // Mark request as completed
        pendingRequests[user].isCompleted = true;
        totalAnalysesCompleted++;
        
        // Emit events
        emit ScoreUpdated(user, score, block.timestamp, msg.sender, mettaRulesHash);
        
        if (mettaRulesHash != bytes32(0)) {
            emit MettaReasoningApplied(user, mettaRulesHash, uint256(scoreAdjustment), block.timestamp);
        }
        
        // Unlock achievements
        if (score >= 900) {
            emit AchievementUnlocked(user, "Elite Reputation", score, block.timestamp);
        } else if (score >= 800) {
            emit AchievementUnlocked(user, "Excellent Reputation", score, block.timestamp);
        } else if (score >= 700) {
            emit AchievementUnlocked(user, "High Reputation", score, block.timestamp);
        } else if (score >= 600) {
            emit AchievementUnlocked(user, "Trusted Member", score, block.timestamp);
        }
    }
    
    /**
     * @dev Batch update scores (gas optimization for Hedera)
     * @param users Array of user addresses
     * @param scores Array of scores
     * @param mettaRulesHashes Array of MeTTa rule hashes
     */
    function batchUpdateScores(
        address[] calldata users,
        uint256[] calldata scores,
        bytes32[] calldata mettaRulesHashes
    ) external nonReentrant onlyRole(ANALYZER_ROLE) {
        require(users.length == scores.length, "Length mismatch");
        require(users.length == mettaRulesHashes.length, "Length mismatch");
        require(users.length <= 50, "Batch too large");
        
        for (uint256 i = 0; i < users.length; i++) {
            require(scores[i] <= 1000, "Invalid score");
            
            uint256 currentVersion = userScores[users[i]].version;
            userScores[users[i]] = ReputationScore({
                score: scores[i],
                timestamp: block.timestamp,
                analyzedBy: msg.sender,
                mettaRulesApplied: mettaRulesHashes[i],
                version: currentVersion + 1
            });
            
            synthiaNFT.updateReputation(users[i], scores[i]);
            
            if (pendingRequests[users[i]].requestTimestamp > 0) {
                pendingRequests[users[i]].isCompleted = true;
            }
        }
        
        totalAnalysesCompleted += users.length;
        emit BatchScoresUpdated(users, scores, block.timestamp);
    }
    
    /**
     * @dev Log analysis to HCS (called by blockchain agent)
     * @param user User address
     * @param hcsMessageId HCS message/sequence number
     */
    function logToHCS(
        address user,
        bytes32 hcsMessageId
    ) external onlyRole(BLOCKCHAIN_ROLE) {
        require(hcsAuditTopicId != bytes32(0), "HCS topic not set");
        emit HCSAuditLogged(user, hcsMessageId, block.timestamp);
    }
    
    /**
     * @dev Get user's full reputation details
     * @param user User address
     */
    function getUserReputation(address user) external view returns (
        uint256 score,
        uint256 timestamp,
        address analyzer,
        bytes32 mettaRules,
        uint256 version,
        uint256 nftTokenId
    ) {
        ReputationScore memory rep = userScores[user];
        uint256 tokenId = synthiaNFT.getTokenId(user);
        
        return (
            rep.score,
            rep.timestamp,
            rep.analyzedBy,
            rep.mettaRulesApplied,
            rep.version,
            tokenId
        );
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStatistics() external view returns (
        uint256 totalAnalyses,
        uint256 totalAgents,
        uint256 pendingCount
    ) {
        return (
            totalAnalysesCompleted,
            totalAgentsRegistered,
            0 // Would need to track this separately
        );
    }
    
    /**
     * @dev Get legacy score for backward compatibility
     */
    function getUserScore(address user) external view returns (uint256 score, uint256 lastUpdated) {
        return (userScores[user].score, userScores[user].timestamp);
    }
}